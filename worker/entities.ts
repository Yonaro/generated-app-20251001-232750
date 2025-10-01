import { IndexedEntity } from "./core-utils";
import type { User, PettyCashRequest } from "@shared/types";
import { MOCK_USERS, MOCK_REQUESTS } from "@shared/mock-app-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", avatarUrl: "", role: "requester" };
  static seedData = MOCK_USERS;
}
// PETTY CASH REQUEST ENTITY: one DO instance per request
export class RequestEntity extends IndexedEntity<PettyCashRequest> {
  static readonly entityName = "request";
  static readonly indexName = "requests";
  static readonly initialState: PettyCashRequest = {
    id: "",
    requesterId: "",
    amount: 0,
    currency: "USD",
    reason: "",
    status: "pending",
    history: [],
    createdAt: "",
    updatedAt: "",
  };
  static seedData = MOCK_REQUESTS;
}