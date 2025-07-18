// server/src/types/pagination.ts

// A generic interface for a paginated API response.
// T will represent the type of the items in the data array (e.g., User, Request).
export interface PaginatedResponse<T> {
  data: T[];         // The array of items for the current page.
  totalItems: number; // The total number of items available in the database.
  currentPage: number; // The current page number.
  pageSize: number;    // The number of items per page.
  totalPages: number;  // The total number of pages available.
}