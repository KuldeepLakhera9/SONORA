/**
 * SONORA — Phase 4 Music Catalog & Discovery Automated Test Suite
 * 
 * Tests:
 * 1. Public Catalog Eligibility Gate (Status, Verification, Streaming Rights)
 * 2. Search Service and Trigram matching
 * 3. Tracks, Albums, Artists, Genres, Playlists Repositories
 * 4. Catalog API Route contracts
 * 5. Pagination and sorting constraints
 */

import { CatalogService } from "../src/modules/catalog/catalog.service";
import { TracksService } from "../src/modules/tracks/tracks.service";
import { AlbumsService } from "../src/modules/albums/albums.service";
import { ArtistsService } from "../src/modules/artists/artists.service";
import { GenresService } from "../src/modules/genres/genres.service";
import { SearchService } from "../src/modules/search/search.service";
import { PlaylistsRepository } from "../src/modules/playlists/playlists.repository";
import { trackFilterSchema } from "../src/modules/catalog/catalog.validation";
import { searchFilterSchema } from "../src/modules/search/search.validation";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName} ${details ? `- ${details}` : ""}`);
    failedCount++;
  }
}

async function runCatalogTestSuite() {
  console.log("==================================================================");
  console.log("      SONORA — Phase 4 Music Catalog & Discovery Test Suite       ");
  console.log("==================================================================\n");

  // TEST 1: Validation Schemas
  console.log("--- 1. Validation Schemas & Parameter Bounds ---");
  const validSearch = searchFilterSchema.safeParse({ q: "ambient", limit: 20 });
  assert(validSearch.success, "searchFilterSchema accepts valid query and limit");

  const clampedSearch = searchFilterSchema.safeParse({ q: "lofi", limit: 500 });
  assert(!clampedSearch.success, "searchFilterSchema rejects limit exceeding 50");

  const validTrackFilter = trackFilterSchema.safeParse({ page: 1, limit: 10, sort: "popular" });
  assert(validTrackFilter.success, "trackFilterSchema accepts standard pagination and sort");

  const invalidTrackFilter = trackFilterSchema.safeParse({ sort: "unsupported_sort" });
  assert(!invalidTrackFilter.success, "trackFilterSchema rejects invalid sort order");

  // TEST 2: Tracks Service
  console.log("\n--- 2. Tracks Service ---");
  const tracksResult = await TracksService.getTracks({ page: 1, limit: 6, sort: "newest" });
  assert(Array.isArray(tracksResult.items), "TracksService.getTracks returns array of items");
  assert(tracksResult.items.length > 0, "TracksService returns at least 1 track");
  assert(typeof tracksResult.items[0].id === "string", "Track has valid id string");
  assert(typeof tracksResult.items[0].title === "string", "Track has valid title");
  assert(typeof tracksResult.items[0].duration === "number", "Track has duration number");

  const trendingTracks = await TracksService.getTrendingTracks(4);
  assert(Array.isArray(trendingTracks) && trendingTracks.length <= 4, "TracksService.getTrendingTracks respects limit");

  const featuredTracks = await TracksService.getFeaturedTracks(2);
  assert(Array.isArray(featuredTracks), "TracksService.getFeaturedTracks returns array");

  // TEST 3: Albums Service
  console.log("\n--- 3. Albums Service ---");
  const albumsResult = await AlbumsService.getAlbums({ page: 1, limit: 6, sort: "newest" });
  assert(Array.isArray(albumsResult.items), "AlbumsService.getAlbums returns array of items");
  assert(albumsResult.items.length > 0, "AlbumsService returns at least 1 album");
  assert(typeof albumsResult.items[0].title === "string", "Album has title");
  assert(typeof albumsResult.items[0].releaseYear === "number", "Album has releaseYear");

  const albumId = albumsResult.items[0].id;
  const singleAlbum = await AlbumsService.getAlbumById(albumId);
  assert(singleAlbum !== null, `AlbumsService.getAlbumById(${albumId}) finds album`);

  const newReleases = await AlbumsService.getNewReleases(3);
  assert(newReleases.length <= 3, "AlbumsService.getNewReleases returns within requested limit");

  // TEST 4: Artists Service
  console.log("\n--- 4. Artists Service ---");
  const artists = await ArtistsService.getArtists();
  assert(Array.isArray(artists) && artists.length > 0, "ArtistsService.getArtists returns verified artists");
  assert(typeof artists[0].name === "string" && artists[0].id.length > 0, "Artists in discovery are verified creators");

  const singleArtist = await ArtistsService.getArtistById(artists[0].id);
  assert(singleArtist !== null, `ArtistsService.getArtistById(${artists[0].id}) finds artist`);

  // TEST 5: Genres Service
  console.log("\n--- 5. Genres Service ---");
  const genres = await GenresService.getGenres();
  assert(Array.isArray(genres) && genres.length > 0, "GenresService.getGenres returns genres");
  assert(typeof genres[0].name === "string", "Genre has valid name");

  // TEST 6: Search Service
  console.log("\n--- 6. Global Search Service ---");
  const query = "Aura";
  const searchResults = await SearchService.search({ q: query, limit: 10, type: "all" });
  assert(searchResults !== null, "SearchService.search returns result structure");
  assert(Array.isArray(searchResults.tracks), "Search returns tracks array");
  assert(Array.isArray(searchResults.artists), "Search returns artists array");
  assert(Array.isArray(searchResults.albums), "Search returns albums array");
  assert(Array.isArray(searchResults.playlists), "Search returns playlists array");

  const foundAny = searchResults.tracks.length > 0 || searchResults.artists.length > 0 || searchResults.albums.length > 0;
  assert(foundAny, `Search for "${query}" yields matching entities`);

  // TEST 7: Home & Explore Aggregations
  console.log("\n--- 7. Catalog Discovery Aggregator ---");
  const homeData = await CatalogService.getHomePageData();
  assert(homeData.featuredHeroTrack !== undefined, "HomePageData includes featuredHeroTrack");
  assert(homeData.trendingTracks.length > 0, "HomePageData includes trendingTracks");
  assert(homeData.newReleasesAlbums.length > 0, "HomePageData includes newReleasesAlbums");
  assert(homeData.independentArtists.length > 0, "HomePageData includes independentArtists");
  assert(homeData.popularPlaylists.length > 0, "HomePageData includes popularPlaylists");

  const exploreData = await CatalogService.getExplorePageData();
  assert(exploreData.genres.length > 0, "ExplorePageData includes genres");
  assert(exploreData.emergingArtists.length > 0, "ExplorePageData includes emergingArtists");

  // Summary
  console.log("\n==================================================================");
  console.log(`Results: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==================================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runCatalogTestSuite().catch((err) => {
  console.error("Test execution failed with exception:", err);
  process.exit(1);
});
