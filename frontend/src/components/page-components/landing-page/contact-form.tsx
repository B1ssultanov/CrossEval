"use client";

export default function ContactForm() {

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container max-w-2xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Contact Us
        </h2>

        <p className="mb-8 text-center text-gray-500">
          We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
        </p>
        <div className="rounded-xl border bg-white p-4 shadow-md">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdZrs09w1j4pnmHebGXA-Q0XzaIHyWxAl579J1KZHCHBUq5sg/viewform?embedded=true"
            width="100%"
            height="600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="w-full"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
}
