import { RESUME_PAGE_DATA } from '@/constants/resume-page-data'
import { ResumeSavePdfButton } from '@/components/public-page/Resume/ResumeSavePdfButton'

function ResumeChipList({
  items,
}: {
  readonly items: readonly string[]
}): React.JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap gap-[7px]">
      {items.map((item) => (
        <span
          key={item}
          className="border border-white/[0.12] px-2.5 py-1.5 font-mono text-[11.5px] text-secondary-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function ResumePageView(): React.JSX.Element {
  const {
    name,
    role,
    contactLine,
    experience,
    selectedWork,
    skills,
    coreTools,
    education,
    languages,
  } = RESUME_PAGE_DATA

  return (
    <main
      data-resume=""
      className="mx-auto max-w-[980px] px-7 pt-[54px] pb-[88px]"
    >
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-white/[0.12] pb-7">
        <div>
          <h1 className="text-[38px] font-semibold tracking-[-0.025em]">
            {name}
          </h1>
          <p className="mt-2.5 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
            {role}
          </p>
          <p className="mt-3.5 font-mono text-[11.5px] tracking-[0.03em] text-muted-foreground">
            {contactLine}
          </p>
        </div>
        <ResumeSavePdfButton />
      </div>

      <div className="grid grid-cols-1 gap-12 pt-9 lg:grid-cols-[1.65fr_1fr] lg:gap-12">
        <div>
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            Experience
          </span>

          <div className="mt-[22px] flex flex-col gap-[30px]">
            {experience.map((roleItem) => (
              <div key={roleItem.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-3.5">
                  <span className="text-[17px] font-semibold tracking-[-0.01em]">
                    {roleItem.title}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {roleItem.period}
                  </span>
                </div>
                <span className="mt-1 block text-[13.5px] text-muted-foreground">
                  {roleItem.org}
                </span>
                <ul className="mt-3.5 flex list-none flex-col gap-2 p-0">
                  {roleItem.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-[11px] text-sm leading-[1.6] text-secondary-foreground"
                    >
                      <span className="shrink-0 text-primary">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <span className="mt-[38px] block font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            Selected work
          </span>
          <div className="mt-[18px] flex flex-col border border-white/10">
            {selectedWork.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-3.5 border-b border-white/[0.07] px-4 py-[13px] last:border-b-0"
              >
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-right font-mono text-[11px] text-muted-foreground">
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-8">
          <div>
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Core skills
            </span>
            <ResumeChipList items={skills} />
          </div>

          <div>
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Tooling
            </span>
            <ResumeChipList items={coreTools} />
          </div>

          <div>
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Education
            </span>
            <div className="mt-4 flex flex-col gap-4">
              {education.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{item.title}</span>
                  <span className="text-[13px] text-muted-foreground">
                    {item.note}
                  </span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Languages
            </span>
            <div className="mt-4 flex flex-col gap-2.5">
              {languages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-sm font-medium">{language.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {language.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
