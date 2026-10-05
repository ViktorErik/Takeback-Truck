import { useState } from "react";
import "./FAQ.css";

const faqData=[
    {
        question: "How does the service work?",
        answer: "WE BLAH BLAH BLAH",
    },
    {
    question: "What products can I return?",
    answer:
      "You can return eligible IKEA products that meet our return requirements.",
    },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <h2>FAQ</h2>

      <div className="faqList">
        {faqData.map((item, index) => (
          <div
            className={`faqItem ${
              openIndex === index ? "faqItem--open" : ""
            }`}
            key={item.question}
          >
            <button
              className="faqQuestion"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>

              <span className="faqIcon">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="faqAnswer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;