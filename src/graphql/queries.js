/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      type
      createdAt
      organization_name
      event_name
      description
      volunteers
      num_volunteers
      location
      date
      start_time
      end_time
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        createdAt
        organization_name
        event_name
        description
        volunteers
        num_volunteers
        location
        date
        start_time
        end_time
        updatedAt
      }
      nextToken
    }
  }
`;
export const eventByCreated = /* GraphQL */ `
  query EventByCreated(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    eventByCreated(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        createdAt
        organization_name
        event_name
        description
        volunteers
        num_volunteers
        location
        date
        start_time
        end_time
        updatedAt
      }
      nextToken
    }
  }
`;
