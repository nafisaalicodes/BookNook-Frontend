import type { Metadata } from "next";
import MyBooksClient from "./mybooksclient";

export const metadata: Metadata = {
  title: "BookNook | My Books",
};

export default function MyBooksPage() {
  return <MyBooksClient />;
}