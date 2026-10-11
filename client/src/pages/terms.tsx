import LegalDocument from '@/components/legal-document';
import markdown from '../../../content/legal/terms-of-service.md?raw';

export default function TermsOfService() {
  return <LegalDocument markdown={markdown} title="Terms of Service | VictorySync" description="Terms governing use of VictorySync services." path="/terms" />;
}
