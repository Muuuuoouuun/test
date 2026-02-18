'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useInView } from '../lib/useInView';

type FormState = {
  academyName: string;
  contact: string;
  size: string;
  needs: string;
};

const INITIAL_FORM: FormState = {
  academyName: '',
  contact: '',
  size: '',
  needs: '',
};

const sectionVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function FadeSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.18 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionVariant}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function MediaCard({
  src,
  alt,
  title,
  caption,
}: {
  src: string;
  alt: string;
  title: string;
  caption: string;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <article className="group rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-zinc-100 aspect-[4/3]">
        {!broken ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Image placeholder
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{caption}</p>
    </article>
  );
}

function buildInquiryText(form: FormState) {
  return [
    'Demo Request',
    `Academy: ${form.academyName}`,
    `Contact: ${form.contact}`,
    `Size: ${form.size}`,
    `Needs: ${form.needs}`,
  ].join('\n');
}

export default function Page() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [copyMessage, setCopyMessage] = useState('');
  const [heroBroken, setHeroBroken] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);
  const reduceMotion = useReducedMotion();
  const beforeAfterRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: beforeAfterRef,
    offset: ['start end', 'end start'],
  });

  const dividerX = useTransform(scrollYProgress, [0, 1], ['35%', '65%']);
  const heroY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['4%', '-4%']);

  const inquiryText = useMemo(() => buildInquiryText(form), [form]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent('[Demo] Academy Inquiry');
    const body = encodeURIComponent(inquiryText);
    window.location.href = `mailto:hello@academy-os.com?subject=${subject}&body=${body}`;
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopyMessage('Inquiry copied. Paste it into your email or messenger.');
    } catch {
      setCopyMessage('Copy failed. Please copy manually from the form.');
    }
    setTimeout(() => setCopyMessage(''), 2400);
  };

  return (
    <main className="bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white">
      <div className="mx-auto max-w-7xl px-6 pb-44 pt-8 md:px-10 md:pb-48 md:pt-10">
        <header className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-md border border-black/10">
              {!logoBroken ? (
                <Image
                  src="/logo-mark.svg"
                  alt="Brand mark"
                  fill
                  className="object-contain p-1"
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-zinc-400">Logo</div>
              )}
            </div>
            <p className="text-sm font-medium tracking-wide text-zinc-700">ACADEMY OS</p>
          </div>
          <a
            href="#contact"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            Demo
          </a>
        </header>

        <section className="grid gap-12 md:grid-cols-2 md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-zinc-500"
            >
              Scale with control
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,6vw,4.3rem)] font-semibold leading-[1.06] tracking-tight"
            >
              확장할수록 흔들리는 수업 품질,
              <br />
              표준화와 AI로 통제 가능한 확장.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-zinc-600"
            >
              다지점 학원·대형 학원·온라인 학원을 위한 운영 레이어. 콘텐츠, 수업 루틴, 상담 데이터를 한
              구조로 정리하고 AI 인사이트로 확장 품질을 일정하게 유지합니다.
            </motion.p>
          </motion.div>

          <motion.div style={{ y: heroY }} className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10 bg-zinc-100">
            {!heroBroken ? (
              <Image
                src="/hw-hero.jpg"
                alt="Premium classroom hardware"
                fill
                priority
                className="object-cover"
                onError={() => setHeroBroken(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">Hero image placeholder</div>
            )}
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-black/40 p-4 text-white backdrop-blur">
              <p className="text-xs uppercase tracking-[0.14em] text-white/80">Premium stack</p>
              <p className="mt-2 text-sm">Unified software + classroom hardware for consistent teaching outcomes.</p>
            </div>
          </motion.div>
        </section>

        <FadeSection className="mt-28">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">문제는 성장 속도가 아니라 품질 편차입니다.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              '지점별 수업 운영 방식이 달라 학습 경험 편차가 커집니다.',
              '신규 교사 온보딩에 시간이 길어지고, 원장 의존도가 높아집니다.',
              '상담 데이터가 분산돼 학부모 신뢰를 유지하기 어렵습니다.',
              '오프라인 수업과 온라인 관리가 분리되어 운영 비용이 증가합니다.',
            ].map((problem) => (
              <div key={problem} className="rounded-2xl border border-black/10 bg-zinc-50 p-6 text-zinc-700">
                {problem}
              </div>
            ))}
          </div>
        </FadeSection>

        <FadeSection className="mt-28 grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">해법은 단순합니다.</h2>
            <p className="mt-4 max-w-lg text-zinc-600">
              콘텐츠와 수업 루틴을 표준화하고, 운영 데이터는 자동으로 정리하며, AI는 리스크와 개선 포인트를 조용히
              제안합니다.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              ['Standardization', '수업 콘텐츠·진도·피드백 루틴을 지점 공통 체계로 정렬'],
              ['Data Automation', '출결·과제·상담 기록을 자동 수집해 운영 리포트 생성'],
              ['AI Insights', '재등록 신호, 학습 리스크, 운영 병목을 안정적으로 파악'],
            ].map(([title, desc]) => (
              <li key={title} className="rounded-2xl border border-black/10 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{title}</p>
                <p className="mt-2 text-zinc-700">{desc}</p>
              </li>
            ))}
          </ul>
        </FadeSection>

        <FadeSection className="mt-28">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">결과는 운영 팀이 체감합니다.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              '운영 효율 상승',
              '교사 준비시간 감소',
              '데이터 기반 상담/재등록',
              '지점 확장 품질 균질화',
            ].map((outcome) => (
              <article key={outcome} className="rounded-2xl border border-black/10 p-5">
                <p className="text-base font-medium text-zinc-800">{outcome}</p>
              </article>
            ))}
          </div>
        </FadeSection>

        <FadeSection className="mt-28">
          <div className="rounded-3xl border border-black/10 bg-zinc-50 p-8 md:p-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Proof snapshot</h2>
              <p className="text-sm text-zinc-500">* 예시 수치</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['도입기관', '120+'],
                ['월간 수업수', '48,000+'],
                ['운영 국가', '5'],
              ].map(([label, num]) => (
                <div key={label} className="rounded-2xl border border-black/10 bg-white p-6">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{num}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection className="mt-28" id="stack">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Product stack</h2>
          <p className="mt-4 text-zinc-600">Software + Hardware를 하나의 경험으로 구성해 현장과 본부를 연결합니다.</p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <MediaCard src="/ui-classroom.png" alt="Classroom software" title="Classroom" caption="수업 실행·진도·피드백 루틴을 표준화" />
            <MediaCard src="/ui-lms.png" alt="LMS software" title="LMS" caption="과제·학습 흐름·학부모 커뮤니케이션 통합" />
            <MediaCard src="/ui-dashboard.png" alt="Drive dashboard" title="Drive Dashboard" caption="지점 성과·운영 지표·상담 데이터 모니터링" />
            <MediaCard src="/hw-board.jpg" alt="Interactive board" title="Board" caption="대형 클래스에서도 일관된 시각 전달" />
            <MediaCard src="/hw-camera.jpg" alt="Classroom camera" title="Camera" caption="수업 기록 및 하이브리드 운영 지원" />
            <MediaCard src="/hw-mic.jpg" alt="Classroom mic" title="Mic" caption="명료한 전달로 강의 집중도 강화" />
          </div>
        </FadeSection>

        <FadeSection className="mt-28" id="compare">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Before / After</h2>
          <div ref={beforeAfterRef} className="relative mt-8 overflow-hidden rounded-3xl border border-black/10 bg-zinc-50">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">Before</p>
                <ul className="mt-4 space-y-3 text-zinc-600">
                  <li>• 지점별 수업 기준이 달라 품질 추적 어려움</li>
                  <li>• 교사별 준비 방식 편차로 운영 리스크 확대</li>
                  <li>• 상담 자료 취합에 시간이 오래 소요</li>
                </ul>
              </div>
              <div className="bg-white p-8 md:p-10">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">After</p>
                <ul className="mt-4 space-y-3 text-zinc-700">
                  <li>• 수업 프로토콜 통합으로 품질 기준 정착</li>
                  <li>• 온보딩 단축으로 신규 지점 초기 안정화</li>
                  <li>• 데이터 기반 상담으로 재등록 전략 고도화</li>
                </ul>
              </div>
            </div>
            <motion.div
              aria-hidden
              style={{ left: dividerX }}
              className="pointer-events-none absolute inset-y-0 w-px bg-zinc-300"
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>
        </FadeSection>

        <FadeSection className="mt-28" id="contact">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">데모 예약</h2>
            <p className="mt-4 text-zinc-600">필요 정보를 남겨주시면 메일 작성 화면이 바로 열립니다.</p>
          </div>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Demo inquiry form">
            {[
              { key: 'academyName', label: '학원명', placeholder: '예: 에이스어학원' },
              { key: 'contact', label: '연락처/이메일', placeholder: '010-0000-0000 또는 email' },
              { key: 'size', label: '규모', placeholder: '예: 15개 반 / 6개 지점' },
            ].map((field) => (
              <label key={field.key} className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                {field.label}
                <input
                  required
                  value={form[field.key as keyof FormState]}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="h-12 rounded-xl border border-black/15 px-4 text-base outline-none transition focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/15"
                />
              </label>
            ))}
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-zinc-700">
              필요사항
              <textarea
                required
                value={form.needs}
                onChange={(event) => setForm((prev) => ({ ...prev, needs: event.target.value }))}
                placeholder="운영 중인 문제, 도입 일정, 기대 효과 등"
                className="min-h-32 rounded-xl border border-black/15 px-4 py-3 text-base outline-none transition focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/15"
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
              >
                메일로 문의 보내기
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium transition hover:border-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
              >
                문의 내용 복사
              </button>
              {copyMessage && <p className="text-sm text-zinc-600">{copyMessage}</p>}
            </div>
          </form>
        </FadeSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">Ready to standardize your scale?</p>
          <a
            href="#contact"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            데모 예약
          </a>
        </div>
      </div>
    </main>
  );
}
