export enum DriverInventoryStatus {
  ASSIGNED = 'ASSIGNED',      // When depot assigns canisters to driver
  IN_TRANSIT = 'IN_TRANSIT',  // When driver confirms receipt and starts delivery
  DELIVERED = 'DELIVERED',    // When driver delivers to customer
  RETURNED = 'RETURNED'       // When driver returns canisters to depot
}
