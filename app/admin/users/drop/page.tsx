import { Suspense } from "react";
import DropUserPage from "./DropUserPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DropUserPage />
    </Suspense>
  );
}