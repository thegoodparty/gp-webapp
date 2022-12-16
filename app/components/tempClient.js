'use client';

export default function TempClient() {
  return (
    <div>
      Client Env <br />
      {JSON.stringify(process.env)}
    </div>
  );
}
