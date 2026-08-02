import { NextResponse } from "next/server";
import {
  hygraphClient,
  GET_TODOS_QUERY,
  CREATE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
} from "../../../../helper/hygraph";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "1";

  try {
    const data = await hygraphClient.request(GET_TODOS_QUERY, { userId });
    return NextResponse.json(data.todos);
  } catch (error) {
    console.error("Hygraph Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch TODOs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const createData = await hygraphClient.request(CREATE_TODO_MUTATION, {
      title: body?.title,
      description: body?.description || "",
      startDate: body?.startDate,
      endDate: body?.endDate,
      userId: body?.userId || "1",
      userType: body?.userType || "admin",
    });

    return NextResponse.json(createData?.createTodo);
  } catch (error) {
    console.error("Hygraph Create Error:", error);
    return NextResponse.json(
      { error: "Failed to create TODO" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await hygraphClient.request(UPDATE_TODO_MUTATION, {
      id: body?.id,
      title: body?.title,
      description: body?.description || "",
      startDate: body?.startDate,
      endDate: body?.endDate,
    });
    return NextResponse.json(data.updateTodo);
  } catch (error) {
    console.error("Hygraph Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update TODO" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required for deletion" },
        { status: 400 }
      );
    }

    const data = await hygraphClient.request(DELETE_TODO_MUTATION, { id });
    return NextResponse.json(data?.deleteTodo);
  } catch (error) {
    console.error("Hygraph Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete TODO" },
      { status: 500 }
    );
  }
}