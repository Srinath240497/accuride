import { GraphQLClient, gql } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT || "";
const token = process.env.HYGRAPH_TOKEN || "";

export const hygraphClient = new GraphQLClient(endpoint, {
  headers: {
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    "gcms-stage": "DRAFT",
  },
});

export const GET_TODOS_QUERY = gql`
  query GetUserTodos($userId: String!) {
    todos(where: { userId: $userId }, orderBy: startDate_ASC) {
      id
      title
      description
      startDate
      endDate
      userId
    }
  }
`;

export const CREATE_TODO_MUTATION = gql`
  mutation CreateTodo(
    $title: String!
    $description: String
    $startDate: DateTime!
    $endDate: DateTime!
    $userId: String!
    $userType: String!
  ) {
    createTodo(
      data: {
        title: $title
        description: $description
        startDate: $startDate
        endDate: $endDate
        userId: $userId
        userType: $userType
      }
    ) {
      id
      title
      description
      startDate
      endDate
      userId
      userType
    }
  }
`;

export const UPDATE_TODO_MUTATION = gql`
  mutation UpdateTodo(
    $id: ID!
    $title: String!
    $description: String
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    updateTodo(
      where: { id: $id }
      data: {
        title: $title
        description: $description
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      id
      title
      description
      startDate
      endDate
    }
  }
`;

export const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;
