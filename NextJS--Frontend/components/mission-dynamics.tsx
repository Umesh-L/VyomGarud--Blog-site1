"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/container";

const stats = [
  {
    label: "Autonomy uptime",
    value: 99.4,
    suffix: "%",
    detail: "Rolling 60-day reliability",
    percent: 0.94,
    precision: 1,
  },
  {
    label: "Median repair cycle",
    value: 2.3,
    suffix: " hrs",
    detail: "Field module swap",
    percent: 0.65,
    precision: 1,
  },
  {
    label: "Global sorties / wk",
    value: 312,
    suffix: " ops",
    detail: "Across five theaters",
    percent: 0.82,
    precision: 0,
  },
];

const timeline = [
  {
    title: "Aurora corridor locked",
    detail: "Hypersonic crosswind path validated",
    time: "00:14 UTC",
  },
  {
    title: "Sat-link rebalance",
    detail: "Dual-band uplink rerouted via VyomNet",
    time: "00:27 UTC",
  },
  {
    title: "Autonomy override cleared",
    detail: "Operator assist downlinked for archive",
    time: "00:42 UTC",
  },
  {
    title: "Thermal climb complete",
    detail: "Payload temps normalize at 37,800 ft",
    time: "00:58 UTC",
  },
];

export function MissionDynamics() {
  const [activated, setActivated] = useState(false);
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1400;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setAnimatedValues(
        stats.map((stat) => {
          const scaled = stat.value * progress;
          return Number(scaled.toFixed(stat.precision));
        })
      );
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    const readyDelay = setTimeout(() => setActivated(true), 100);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(readyDelay);
    };
  }, []);

  return (
    <section className={`mission-dynamics ${activated ? "mission-dynamics--ready" : ""}`}>
      <Container className="mission-dynamics__shell">
        <div className="mission-dynamics__visual">
          <div className="mission-dynamics__pulse" />
          <div className="mission-dynamics__orbit mission-dynamics__orbit--outer" />
          <div className="mission-dynamics__orbit mission-dynamics__orbit--mid" />
          <div className="mission-dynamics__orbit mission-dynamics__orbit--inner" />
          <div className="mission-dynamics__node mission-dynamics__node--one" />
          <div className="mission-dynamics__node mission-dynamics__node--two" />
          <div className="mission-dynamics__node mission-dynamics__node--three" />
          <div className="mission-dynamics__drone">
            <Image src="/icons/VYOMGARUD.jpg" alt="VyomGarud Systems" fill className="object-cover" />
          </div>
          <div className="mission-dynamics__sweep" />
          <div className="mission-dynamics__chip mission-dynamics__chip--one">
            <p>Altitude lock</p>
            <strong>37,800 ft</strong>
          </div>
          <div className="mission-dynamics__chip mission-dynamics__chip--two">
            <p>Signal clarity</p>
            <strong>98.2%</strong>
          </div>
          <div className="mission-dynamics__ticker">
            <span>Telemetry sweep</span>
            <div className="mission-dynamics__ticker-line">
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="mission-dynamics__copy">
          <p className="mission-dynamics__eyebrow">Orbital telemetry</p>
          <h2>Mission-wide statistical intelligence, refreshed every 11 seconds</h2>
          <p>
            The VyomGarud control lattice fuses sat-link noise, wind shear predictions, and swarm autonomy cues into a continuous animation of fleet
            confidence. These are the live numbers command uses before green-lighting every sortie.
          </p>

          <div className="mission-dynamics__stats">
            {stats.map((stat, index) => (
              <article key={stat.label}>
                <div className="mission-dynamics__stat-value">
                  <strong>
                    {animatedValues[index].toFixed(stat.precision)}
                    <span>{stat.suffix}</span>
                  </strong>
                  <p>{stat.label}</p>
                </div>
                <p className="mission-dynamics__stat-detail">{stat.detail}</p>
                <div
                  className="mission-dynamics__stat-bar"
                  style={{ "--fill-width": `${stat.percent * 100}%` } as CSSProperties}
                >
                  <span />
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>

      <ul className="mission-dynamics__timeline">
        {timeline.map((entry) => (
          <li key={entry.title}>
            <span className="mission-dynamics__timeline-time">{entry.time}</span>
            <strong>{entry.title}</strong>
            <p>{entry.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
