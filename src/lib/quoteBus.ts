import type { ServiceId } from "../data/services";

export const QUOTE_SELECT_EVENT = "dg:quote-select";

/** Lets any section preselect a service in the quote form. */
export const selectQuoteService = (service: ServiceId): void => {
  window.dispatchEvent(new CustomEvent<ServiceId>(QUOTE_SELECT_EVENT, { detail: service }));
};
