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
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function FadeSection({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.18 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionVariant}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-zinc-800 bg-zinc-900">
      {!broken ? (
        <Image src={src} alt={alt} fill className="object-cover" onError={() => setBroken(true)} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-zinc-400">Image placeholder · {src}</div>
      )}
    </div>
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
  const [copied, setCopied] = useState('');
  const reduceMotion = useReducedMotion();
  const compareRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: compareRef, offset: ['start end', 'end start'] });
  const dividerX = useTransform(scrollYProgress, [0, 1], ['42%', '58%']);

  const inquiryText = useMemo(() => buildInquiryText(form), [form]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent('[Demo] Academy OS Inquiry');
    const body = encodeURIComponent(inquiryText);
    window.location.href = `mailto:hello@academy-os.com?subject=${subject}&body=${body}`;
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopied('Inquiry copied. Paste anywhere.');
    } catch {
      setCopied('Copy failed. Please copy manually.');
    }
    setTimeout(() => setCopied(''), 2200);
  };

  return (
    <main className="bg-[#0A0A0A] text-[#F5F5F7]">
      <div className="mx-auto max-w-[1240px] px-6 pb-40 pt-8 md:px-12 md:pb-44 md:pt-10">
        <header className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
              <SafeImage src="/logo-mark.svg" alt="Logo" />
            </div>
            <p className="text-sm font-semibold tracking-[0.14em] text-zinc-300">ACADEMY OS</p>
          </div>
          <a
            href="#contact"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            Demo
          </a>
        </header>

        <section id="hero" className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
            >
              Controlled Scale
            </motion.p>
            {['확장할수록 흔들리는 수업,', '이제 통제 가능한 성장으로.'].map((line, index) => (
              <motion.h1
                key={line}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.3rem,6.2vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.02em]"
              >
                {line}
              </motion.h1>
            ))}
            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65 }}
              className="mt-8 max-w-xl text-[17px] leading-relaxed text-zinc-400"
            >
              지점이 늘어도 품질은 흔들리지 않아야 합니다. 표준화·데이터 자동화·AI 인사이트로 학원 운영을 기준
              중심으로 전환합니다.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.75 }}
            className="relative aspect-[4/3]"
          >
            <SafeImage src="/hw-hero.jpg" alt="Hero hardware" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Unified Stack</p>
              <p className="mt-2 text-sm text-zinc-100">Software + Hardware for stable classroom quality.</p>
            </div>
          </motion.div>
        </section>

        <FadeSection id="problem" className="pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">문제는 성장 속도가 아니라, 품질 편차입니다.</h2>
          <p className="mt-5 max-w-3xl text-[17px] text-zinc-400">
            확장 구간에서 수업 편차, 신규 교사 온보딩 비용, 온·오프라인 분리, 데이터 근거 부족이 동시에 커집니다.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              '확장할수록 지점별 수업 품질 편차가 커집니다.',
              '신규 교사 온보딩 비용과 시간이 누적됩니다.',
              '온라인 운영과 오프라인 운영이 분리됩니다.',
              '상담·재등록 판단의 데이터 근거가 부족합니다.',
            ].map((item) => (
              <article key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 text-zinc-300">
                {item}
              </article>
            ))}
          </div>
        </FadeSection>

        <FadeSection id="solution" className="pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">해결은 단순합니다: 표준화, 자동화, 그리고 인사이트.</h2>
          <p className="mt-5 max-w-3xl text-[17px] text-zinc-400">
            콘텐츠·수업 루틴을 표준화하고, 출결·과제·평가를 자동화하며, AI로 상담·재등록 근거를 정리합니다.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Standardization', '콘텐츠·진도·피드백 루틴을 지점 공통 기준으로 통일'],
              ['Data Automation', '출결·과제·평가를 자동 수집해 운영 리포트 생성'],
              ['AI Insight', '상담 우선순위와 재등록 신호를 근거 기반으로 제시'],
            ].map(([title, desc]) => (
              <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
                <p className="mt-3 text-zinc-300">{desc}</p>
              </article>
            ))}
          </div>
        </FadeSection>

        <FadeSection id="outcomes" className="pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">운영팀이 먼저 체감하는 변화가, 재등록을 만듭니다.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['운영 효율 향상', '교사 준비시간 감소', '데이터 기반 상담/재등록', '지점 확장 품질 균질화'].map((item) => (
              <article key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-zinc-200">
                {item}
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-7 md:p-8">
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-bold tracking-tight">Proof snapshot</p>
              <p className="text-xs text-zinc-500">* 예시 수치</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['도입기관', '120+'],
                ['월간 수업수', '48,000+'],
                ['운영 국가', '5'],
              ].map(([label, number]) => (
                <div key={label} className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{number}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection id="stack" className="pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">현장과 본부를 하나의 스택으로 연결합니다.</h2>
          <p className="mt-5 text-[17px] text-zinc-400">UI는 적게 크게, 하드웨어는 히어로 + 보조 카드로 명확하게 보여줍니다.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[16/10]">
              <SafeImage src="/ui-dashboard.png" alt="Dashboard UI" />
            </div>
            <div className="relative aspect-[16/10]">
              <SafeImage src="/ui-classroom.png" alt="Classroom UI" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ['/hw-board.jpg', 'Board'],
              ['/hw-camera.jpg', 'Camera'],
              ['/hw-mic.jpg', 'Mic'],
            ].map(([src, title]) => (
              <article key={title} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="relative aspect-[4/3]">
                  <SafeImage src={src} alt={title} />
                </div>
                <p className="text-sm font-medium text-zinc-300">{title}</p>
              </article>
            ))}
          </div>
        </FadeSection>

        <FadeSection id="compare" className="pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">도입 전후의 차이는 기능이 아니라 운영 상태입니다.</h2>
          <div ref={compareRef} className="relative mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Before</p>
                <ul className="mt-4 space-y-3 text-zinc-400">
                  <li>• 교사 역량에 따라 수업 품질이 달라짐</li>
                  <li>• 지점별 운영 프로세스가 다르게 누적됨</li>
                  <li>• 상담과 재등록 판단이 경험 의존적임</li>
                </ul>
              </div>
              <div className="bg-[#111113] p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">After</p>
                <ul className="mt-4 space-y-3 text-zinc-300">
                  <li>• 기준 중심 수업 운영으로 품질 편차 완화</li>
                  <li>• 신규 교사 온보딩 속도와 재현성 향상</li>
                  <li>• 데이터 기반 상담으로 재등록 전략 정교화</li>
                </ul>
              </div>
            </div>
            <motion.div
              aria-hidden
              style={{ left: dividerX }}
              className="pointer-events-none absolute inset-y-0 w-px bg-zinc-600"
              transition={{ type: 'spring', stiffness: 65, damping: 16 }}
            />
          </div>
        </FadeSection>

        <FadeSection id="contact" className="pb-8 pt-24 md:pt-32">
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.01em]">데모 예약, 15분이면 충분합니다.</h2>
          <p className="mt-5 max-w-2xl text-[17px] text-zinc-400">필요 정보를 남기면 메일 작성이 열리고, 문의 텍스트는 즉시 복사할 수 있습니다.</p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Demo form">
            {[
              ['academyName', '학원명', '예: OO어학원 본원'],
              ['contact', '연락처/이메일', '예: 010-0000-0000'],
              ['size', '규모', '예: 8개 지점 / 2100명'],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="flex flex-col gap-2 text-sm text-zinc-300">
                {label}
                <input
                  required
                  value={form[key as keyof FormState]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  placeholder={placeholder}
                  className="h-12 rounded-xl border border-zinc-700 bg-[#121214] px-4 text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300/40"
                />
              </label>
            ))}
            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-zinc-300">
              필요사항
              <textarea
                required
                value={form.needs}
                onChange={(event) => setForm((prev) => ({ ...prev, needs: event.target.value }))}
                placeholder="운영 문제, 도입 일정, 기대하는 변화"
                className="min-h-32 rounded-xl border border-zinc-700 bg-[#121214] px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300/40"
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#F5F5F7] px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#E4E4E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              >
                메일로 데모 요청
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              >
                문의 내용 복사
              </button>
              {copied ? <p className="text-sm text-zinc-400">{copied}</p> : null}
            </div>
          </form>
        </FadeSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-black/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">Ready to standardize your scale?</p>
          <a
            href="#contact"
            className="rounded-full bg-[#F5F5F7] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#E4E4E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            데모 예약
          </a>
        </div>
      </div>
    </main>
  );
}
