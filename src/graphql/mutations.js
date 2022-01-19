/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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