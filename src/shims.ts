/** Returns the full discord proxy url */
export function proxyUrl(
    transport: 'https' | 'wss',
    route: `/${string}` | '' = '',
  ) {
    if (!import.meta.env.VITE_DISCORD_CLIENT_ID) {
      throw new Error('Missing Application ID');
    }
    return `${transport}://${import.meta.env.VITE_DISCORD_CLIENT_ID}.discordsays.com${route}`;
  }
  
// url mappings

type Mapping = {
  key: string | RegExp;
  target: (tokens?: string[]) => string;
};

const mappings: Mapping[] = [
  {
    key: new RegExp('https://(.+)\\.googleapis\\.com/'),
    target: (tokens?: string[]) =>
      `/googleapis/${tokens && tokens.length ? tokens[0] : 'invalid'}/`,
  },
  {
    key: new RegExp('wss://(.+)\\.firebaseio\\.com/'),
    target: (tokens?: string[]) =>
      `/firebaseio/${tokens && tokens.length ? tokens[0] : 'invalid'}/`,
  },
  {
    key: new RegExp('https://(.+)\\.firebaseio\\.com/'),
    target: (tokens?: string[]) =>
      `/firebaseio/${tokens && tokens.length ? tokens[0] : 'invalid'}/`,
  },
];

// fetch intercept

const fetchImpl = window.fetch;
// @ts-ignore - fetch is a duplex, but this is consistent
window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
  const remapped = attemptRemap(input.toString(), 'https', mappings);
  return fetchImpl(remapped, init);
};

// xhr intercept

const openImpl = XMLHttpRequest.prototype.open;
// @ts-expect-error - the ts interface exports two 'open' methods
XMLHttpRequest.prototype.open = function (
  method: string,
  url: string,
  async: boolean,
  username?: string | null,
  password?: string | null,
) {
  const remapped = attemptRemap(url, 'https', mappings);
  openImpl.apply(this, [method, remapped, async, username, password]);
};

// web socket intercept

class WebSocketProxy extends WebSocket {
  constructor(url: string | URL, protocols?: string | string[]) {
    const remapped = attemptRemap(url.toString(), 'wss', mappings);
    super(remapped, protocols);
  }
}
window.WebSocket = WebSocketProxy;

const appendChildImpl = document.body.appendChild;
document.body.appendChild = <T extends Node>(node: T) => {
  if (node instanceof HTMLImageElement || node instanceof HTMLScriptElement) {
    node.src = attemptRemap(node.src, 'https', mappings)
  }
  return appendChildImpl.call<unknown, [T], T>(document.body, node);
};

// utility

const attemptRemap = (url: string, transport: 'https' | 'wss', mappings: Mapping[]): string => {
      let mappedUrl = url;

      for (let i = 0, n = mappings.length; i < n; ++i) {
        const mapping = mappings[i];
        if (typeof mapping.key === 'string') {
          // 1-1 string
          if (mappedUrl.startsWith(mapping.key)) {
            const target = mapping.target();
            mappedUrl = `${proxyUrl(transport)}${target}${url.substr(
              mapping.key.length,
            )}`;
            // console.log(`Routed: ${url} -> ${mappedUrl}`);
            break;
          }
        } else {
          // RegExp with tokenization
          const matches = mappedUrl.match(mapping.key);
          if (matches) {
            const target = mapping.target(matches.slice(1));
            mappedUrl = `${proxyUrl(transport)}${target}${url.substr(
              matches[0].length,
            )}`;
            // console.log(`Routed: ${url} -> ${mappedUrl}`);
            break;
          }
        }
      }

      return mappedUrl;
    }

/**
 * Export the remap function with a more explicit name for special case usage
 */
export const remapRawUrlForProxy = (
  url: string,
  transport: 'https' | 'wss' = 'https',
) => attemptRemap(url, transport, mappings);