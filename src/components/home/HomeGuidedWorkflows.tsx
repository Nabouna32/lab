import { PageContainer } from "@/components/layout/PageLayout";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getGuidedWorkflowsPath } from "@/lib/tools/routes";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { CardLink } from "@/components/ui/Card";
import { Alignment } from "@/components/layout/compose/Alignment";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Row } from "@/components/layout/compose/Row";
import { Box } from "@/components/layout/compose/Box";

export default function HomeGuidedWorkflows({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <section aria-label={t.guidedWorkflows.homeTitle}>
      <PageContainer
        width="wide"
        spacing="none"
        className="pb-[var(--space-8)] sm:pb-[var(--space-10)]"
      >
        <CardLink
          href={getGuidedWorkflowsPath(locale)}
          className="group block min-h-20 p-4 transition-[background-color,border-color] duration-[var(--motion-standard)] hover:bg-[var(--surface-container-low)] motion-reduce:transition-none"
        >
          <Row
            horizontalArrangement={Arrangement.spacedBy("var(--layout-item-gap)")}
            verticalAlignment={Alignment.CenterVertically}
            className="min-w-0"
          >
            <Box
              contentAlignment={Alignment.Center}
              className="size-10 shrink-0 rounded-[var(--shape-corner-medium)] bg-[var(--primary-container)] text-[var(--on-primary-container)]"
              aria-hidden="true"
            >
              <MaterialIcon name="swap_horiz" size={24} />
            </Box>
            <span className="min-w-0 flex-1">
              <span className="m3-type-title-medium block text-[var(--on-surface)]">
                {t.guidedWorkflows.homeTitle}
              </span>
              <span className="m3-type-body-medium mt-1 block text-[var(--on-surface-variant)]">
                {t.guidedWorkflows.homeDescription}
              </span>
            </span>
            <span className="m3-type-label-large inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-1 rounded-full px-3 text-[var(--primary)] transition-colors duration-[var(--motion-standard)] group-hover:bg-[var(--primary-container)] group-hover:text-[var(--on-primary-container)] motion-reduce:transition-none sm:px-4">
              <span className="hidden sm:inline">{t.guidedWorkflows.homeAction}</span>
              <MaterialIcon name="arrow_forward" size={24} />
            </span>
          </Row>
        </CardLink>
      </PageContainer>
    </section>
  );
}
