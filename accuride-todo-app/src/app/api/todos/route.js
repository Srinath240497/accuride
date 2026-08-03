// src/app/api/todos/route.js

// Import Libraries
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Import Functions
import {
  hygraphClient,
  GET_TODOS_QUERY,
  CREATE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
} from "../../../../helper/hygraph";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * 
 * @param {request} request 
 * @returns 
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const data = await hygraphClient.request(GET_TODOS_QUERY, { userId });
    return NextResponse.json(data?.todos || []);
  } catch (error) {
    console.error("Hygraph Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch TODOs" },
      { status: 500 }
    );
  }
}

/**
 * 
 * @param {request} request 
 * @returns 
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const createData = await hygraphClient.request(CREATE_TODO_MUTATION, {
      title: body?.title,
      description: body?.description || "",
      startDate: body?.startDate,
      endDate: body?.endDate,
      userId: session.user.id,
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

/**
 * 
 * @param {request} request 
 * @returns 
 */
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const body = await request.json();
  const id = searchParams.get("id") || body?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing TODO ID" }, { status: 400 });
  }

  try {
    const data = await hygraphClient.request(UPDATE_TODO_MUTATION, {
      id,
      title: body?.title,
      description: body?.description || "",
      startDate: body?.startDate,
      endDate: body?.endDate,
      userId: session.user.id,
      userType: body?.userType || "admin",
    });

    return NextResponse.json(data?.updateTodo);
  } catch (error) {
    console.error("Hygraph Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update TODO" },
      { status: 500 }
    );
  }
}

/**
 * 
 * @param {request} request 
 * @returns 
 */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing TODO ID" }, { status: 400 });
  }

  try {
    const data = await hygraphClient.request(DELETE_TODO_MUTATION, { id });
    return NextResponse.json({ success: true, deletedId: data?.deleteTodo?.id });
  } catch (error) {
    console.error("Hygraph DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete TODO" },
      { status: 500 }
    );
  }
}