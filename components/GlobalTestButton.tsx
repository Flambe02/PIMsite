"use client";
export function GlobalTestButton() {
  return (
    <button
      onClick={() => alert('Global button clicked!')}
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        zIndex: 9999,
        background: 'yellow',
        color: 'black',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      Global Test Click
    </button>
  );
} 