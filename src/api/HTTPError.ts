import { ApolloResponse } from "src/api/ApolloResponse";

export class HTTPError extends Error {
  response: ApolloResponse;
  request: Request;

  constructor(response: ApolloResponse, request: Request) {
    super(response.statusText);
    this.response = response;
    this.request = request;
  }
}
