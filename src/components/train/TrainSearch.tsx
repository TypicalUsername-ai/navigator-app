import { useState } from "react";
import { Button } from "@/components/ui";

export type TrainSearchParams = {
  from: string;
  to: string;
  time: string; 
};

export default function TrainSearch({ onSearch }: { onSearch: (params: TrainSearchParams) => void }) {
  const [form, setForm] = useState<TrainSearchParams>({ from: "", to: "", time: "" });

  const update = (key: keyof TrainSearchParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    onSearch(form);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md mx-auto flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">stacja z</label>
        <input
          className="border rounded-md px-3 py-2"
          placeholder="np. Warszawa"
          value={form.from}
          onChange={update("from")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">stacja do</label>
        <input
          className="border rounded-md px-3 py-2"
          placeholder="np. Kraków"
          value={form.to}
          onChange={update("to")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">godzina</label>
        <input
          className="border rounded-md px-3 py-2"
          type="time"
          value={form.time}
          onChange={update("time")}
        />
      </div>
      <Button type="submit" className="mt-2">Szukaj połączenia</Button>
    </form>
  );
}
