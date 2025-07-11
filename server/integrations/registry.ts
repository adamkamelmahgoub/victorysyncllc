
import type { Connector } from './types';
import { hubspotConnector } from './hubspot';
import { five9Connector } from './five9';

export const connectorRegistry = new Map<string, Connector>([
  ['hubspot', hubspotConnector],
  ['five9', five9Connector]
]);

export function getConnector(type: string): Connector | undefined {
  return connectorRegistry.get(type);
}

export function getAllConnectors(): Connector[] {
  return Array.from(connectorRegistry.values());
}
