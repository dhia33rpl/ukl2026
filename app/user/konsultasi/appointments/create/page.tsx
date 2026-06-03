import { Suspense } from "react";
import CreateAppointment from "./CreateAppointment";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAppointment />
    </Suspense>
  );
}