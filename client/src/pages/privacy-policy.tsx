import LegalDocument from '@/components/legal-document';
import markdown from '../../../content/legal/privacy-policy.md?raw';

export default function PrivacyPolicy() {
  return <LegalDocument markdown={markdown} title="Privacy Policy | VictorySync" description="How VictorySync collects, uses, and protects personal information." path="/privacy-policy" />;
}
