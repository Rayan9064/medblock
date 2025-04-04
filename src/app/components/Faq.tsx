"use client";
import { FaqSection } from "@/components/ui/faq";

const FAQS = [
  {
    question: "How do I upload my medical report?",
    answer: "You can simply upload a PDF or image file, and MedBlock will securely store it on IPFS while minting an NFT as proof of authenticity.",
  },
  {
    question: "Can I share my medical reports with my doctor?",
    answer: "Yes! You can generate a secure access link that allows your doctor to view your report without needing to own crypto or a blockchain wallet.",
  },
  {
    question: "Can I delete my medical records from the blockchain?",
    answer: "While blockchain is immutable, we provide an option to revoke access and disable future sharing of your records.",
  },
  {
    question: "Is my medical data really secure?",
    answer: "Yes! Your data is encrypted and stored on decentralized storage (IPFS/Arweave), making it tamper-proof and accessible only to authorized users.",
  },
  {
    question: "Can anyone see my medical reports?",
    answer: "No, only users with permission (such as your doctor or a trusted healthcare provider) can access your records.",
  },
  {
    question: "What happens if I lose access to my wallet?",
    answer: "You can recover access through backup mechanisms. We recommend securely storing your recovery phrase and linking an emergency contact.",
  },
  {
    question: "Do I need to understand blockchain to use MedBlock?",
    answer: "No! The platform handles blockchain operations in the background. You can use it just like any regular medical record system.",
  },
  {
    question: "How do I verify the authenticity of a medical report?",
    answer: "Each report is linked to a unique NFT that can be verified on the blockchain. You can check ownership and integrity using the verification tool on MedBlock.",
  },
];

export function Faq() {
  return (
    <FaqSection
      title="Frequently Asked Questions"
      description="Everything you need to know about our platform"
      items={FAQS}
      contactInfo={{
        title: "Still have questions?",
        description: "We're here to help you",
        buttonText: "Contact Support",
        onContact: () => console.log("Contact support clicked"),
      }}
    />
  );
}