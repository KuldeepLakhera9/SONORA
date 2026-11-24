import { SearchRepository } from "./search.repository";
import type { SearchFilterParams } from "./search.validation";
import type { SearchResultsPayload } from "./search.types";

export const SearchService = {
  async search(params: SearchFilterParams): Promise<SearchResultsPayload> {
    return await SearchRepository.searchCatalog(params);
  },
};
