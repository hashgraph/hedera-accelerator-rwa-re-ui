"use client";

type PaymentNotesFieldProps = {
  notes: string;
  setNotes: (value: string) => void;
};

export function PaymentNotesField({ notes, setNotes }: PaymentNotesFieldProps) {
  return (
    <div>
      <label className="block mb-1 font-semibold" htmlFor="notes">
        Notes (Memo)
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="textarea textarea-bordered w-full"
        placeholder="Optional notes or memo..."
        rows={3}
      />
    </div>
  );
}