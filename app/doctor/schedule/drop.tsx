"use client";

type Props = {
  scheduleId: number;
  onSuccess: () => void;
};

export default function DropSchedule({
  scheduleId,
  onSuccess,
}: Props) {
  const deleteSchedule = async () => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus jadwal ini?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/doctors/me/schedule/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message);
        onSuccess();
      } else {
        alert(result.message || "Gagal menghapus jadwal");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <button
      onClick={deleteSchedule}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
    >
      Delete
    </button>
  );
}