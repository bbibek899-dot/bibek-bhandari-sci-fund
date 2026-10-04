import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useCampaign } from '../context/CampaignContext';
import {
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface GaugeProps {
  className?: string;
}

export const CampaignProgressGauge: React.FC<GaugeProps> = ({ className = '' }) => {
  const {
    campaign,
    donations,
    totalVerifiedRaised,
    totalPendingRaised,
    progressPercent,
    verifiedSupportersCount
  } = useCampaign();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [gaugeMode, setGaugeMode] = useState<'verified' | 'combined'>('combined');

  const targetAmount = campaign.targetAmount || 7500000;
  const verifiedAmount = totalVerifiedRaised;
  const pendingAmount = totalPendingRaised;
  const combinedAmount = verifiedAmount + pendingAmount;

  const currentDisplayAmount = gaugeMode === 'combined' ? combinedAmount : verifiedAmount;
  const rawProgress = targetAmount > 0 ? currentDisplayAmount / targetAmount : 0;
  const verifiedProgress = targetAmount > 0 ? verifiedAmount / targetAmount : 0;
  const clampedProgress = Math.min(1.2, Math.max(0, rawProgress));

  const remainingToGoal = Math.max(0, targetAmount - verifiedAmount);
  const daysTotal = 1260; // 3.5 years protocol
  const daysRemaining = campaign.daysRemaining || 1200;
  const daysElapsed = Math.max(1, daysTotal - daysRemaining);

  // Milestones along the gauge
  const milestones = [
    { percent: 0, label: '0%', title: 'Campaign Launch', targetNpr: 0 },
    { percent: 25, label: '25%', title: 'Phase 1: Year 1 Daily Physio', targetNpr: targetAmount * 0.25 },
    { percent: 50, label: '50%', title: 'Phase 2: Halfway Mobility Milestone', targetNpr: targetAmount * 0.5 },
    { percent: 75, label: '75%', title: 'Phase 3: Active Gait & Standing', targetNpr: targetAmount * 0.75 },
    { percent: 100, label: '100%', title: 'Goal: 3.5 Yrs Full Neuro-Rehab', targetNpr: targetAmount }
  ];

  // D3 Gauge Render Effect
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 420;
    const height = 270;
    const centerX = width / 2;
    const centerY = height - 45;
    const outerRadius = 150;
    const innerRadius = 118;

    // Angle span: 220 degrees (-110 deg to +110 deg)
    const minAngleDeg = -110;
    const maxAngleDeg = 110;
    const minAngleRad = (minAngleDeg * Math.PI) / 180;
    const maxAngleRad = (maxAngleDeg * Math.PI) / 180;
    const totalAngleRad = maxAngleRad - minAngleRad;

    // Defs for gradients & shadow filters
    const defs = svg.append('defs');

    // Linear gradient for verified progress arc
    const progressGradient = defs
      .append('linearGradient')
      .attr('id', 'gaugeProgressGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', centerX - outerRadius)
      .attr('y1', centerY)
      .attr('x2', centerX + outerRadius)
      .attr('y2', centerY);

    progressGradient.append('stop').attr('offset', '0%').attr('stop-color', '#047857');
    progressGradient.append('stop').attr('offset', '45%').attr('stop-color', '#10b981');
    progressGradient.append('stop').attr('offset', '80%').attr('stop-color', '#34d399');
    progressGradient.append('stop').attr('offset', '100%').attr('stop-color', '#6ee7b7');

    // Pending gradient (amber-gold)
    const pendingGradient = defs
      .append('linearGradient')
      .attr('id', 'gaugePendingGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', centerX - outerRadius)
      .attr('y1', centerY)
      .attr('x2', centerX + outerRadius)
      .attr('y2', centerY);

    pendingGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b');
    pendingGradient.append('stop').attr('offset', '100%').attr('stop-color', '#fbbf24');

    // Soft drop shadow filter for needle & indicators
    const dropShadow = defs
      .append('filter')
      .attr('id', 'gaugeGlow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    dropShadow.append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '2')
      .attr('stdDeviation', '4')
      .attr('flood-color', '#10b981')
      .attr('flood-opacity', '0.35');

    const g = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`);

    // Arc generator helper
    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(8);

    // 1. Background Track Arc
    const backgroundArc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(minAngleRad)
      .endAngle(maxAngleRad)
      .cornerRadius(8);

    g.append('path')
      .attr('d', backgroundArc as any)
      .attr('fill', '#e2e8f0')
      .attr('opacity', 0.85);

    // Subtle inner track guide
    const innerGuideArc = d3
      .arc()
      .innerRadius(innerRadius - 6)
      .outerRadius(innerRadius - 4)
      .startAngle(minAngleRad)
      .endAngle(maxAngleRad);

    g.append('path')
      .attr('d', innerGuideArc as any)
      .attr('fill', '#cbd5e1')
      .attr('opacity', 0.5);

    // 2. Pending Contributions Arc (if combined mode active and pending exists)
    if (gaugeMode === 'combined' && pendingAmount > 0) {
      const verifiedAngle = minAngleRad + Math.min(1.0, verifiedProgress) * totalAngleRad;
      const combinedAngle = minAngleRad + Math.min(1.0, clampedProgress) * totalAngleRad;

      if (combinedAngle > verifiedAngle) {
        const pendingArc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(verifiedAngle)
          .endAngle(combinedAngle)
          .cornerRadius(8);

        g.append('path')
          .attr('d', pendingArc as any)
          .attr('fill', 'url(#gaugePendingGradient)')
          .attr('opacity', 0.9)
          .attr('stroke', '#d97706')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,3');
      }
    }

    // 3. Verified Progress Arc with animated tween
    const targetProgressAngle = minAngleRad + Math.min(1.0, verifiedProgress) * totalAngleRad;

    const progressPath = g
      .append('path')
      .datum({ endAngle: minAngleRad })
      .attr('fill', 'url(#gaugeProgressGradient)')
      .attr('filter', 'url(#gaugeGlow)');

    progressPath
      .transition()
      .duration(1100)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d: any) {
        const interpolate = d3.interpolate(d.endAngle, targetProgressAngle);
        return function (t: number) {
          d.endAngle = interpolate(t);
          return (arcGenerator({
            innerRadius,
            outerRadius,
            startAngle: minAngleRad,
            endAngle: d.endAngle
          } as any) || '');
        };
      });

    // 4. Milestone Tick Lines & Badges
    milestones.forEach((m) => {
      const fraction = m.percent / 100;
      const angleRad = minAngleRad + fraction * totalAngleRad;

      // Coordinate math
      const cosA = Math.cos(angleRad - Math.PI / 2);
      const sinA = Math.sin(angleRad - Math.PI / 2);

      const tickInner = outerRadius + 4;
      const tickOuter = outerRadius + 14;
      const labelRadius = outerRadius + 26;

      const isReached = (verifiedProgress * 100) >= m.percent;
      const isSelected = selectedMilestone === m.percent;

      // Tick line
      g.append('line')
        .attr('x1', cosA * tickInner)
        .attr('y1', sinA * tickInner)
        .attr('x2', cosA * tickOuter)
        .attr('y2', sinA * tickOuter)
        .attr('stroke', isReached ? '#059669' : '#94a3b8')
        .attr('stroke-width', isSelected ? 3 : isReached ? 2 : 1.5)
        .attr('stroke-linecap', 'round');

      // Milestone dot
      g.append('circle')
        .attr('cx', cosA * (outerRadius - (outerRadius - innerRadius) / 2))
        .attr('cy', sinA * (outerRadius - (outerRadius - innerRadius) / 2))
        .attr('r', isSelected ? 4.5 : 2.5)
        .attr('fill', isReached ? '#ffffff' : '#94a3b8')
        .attr('stroke', isReached ? '#047857' : '#64748b')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedMilestone(m.percent));

      // Label text
      g.append('text')
        .attr('x', cosA * labelRadius)
        .attr('y', sinA * labelRadius + 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
        .attr('font-weight', isSelected ? '700' : isReached ? '600' : '500')
        .attr('fill', isSelected ? '#047857' : isReached ? '#0f172a' : '#64748b')
        .style('cursor', 'pointer')
        .text(m.label)
        .on('click', () => setSelectedMilestone(m.percent));
    });

    // 5. Gauge Needle Indicator
    const needleGroup = g.append('g').attr('class', 'gauge-needle');

    const currentAngleRad = minAngleRad + Math.min(1.0, clampedProgress) * totalAngleRad;

    // Needle spindle circle at center
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 16)
      .attr('fill', '#0f172a')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))');

    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', '#10b981');

    // Needle pointer with smooth entry animation
    const needleLength = innerRadius - 12;
    const needlePath = needleGroup
      .append('path')
      .attr('d', `M -3 0 L 0 ${-needleLength} L 3 0 Z`)
      .attr('fill', '#0f172a')
      .attr('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))');

    needleGroup.attr('transform', `rotate(${(minAngleRad * 180) / Math.PI})`);

    needleGroup
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('transform', `rotate(${(currentAngleRad * 180) / Math.PI})`);

    // Head pip on outer arc edge for high clarity
    const headPip = g.append('circle')
      .attr('r', 7)
      .attr('fill', '#ffffff')
      .attr('stroke', '#047857')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#gaugeGlow)');

    const cosCurrent = Math.cos(currentAngleRad - Math.PI / 2);
    const sinCurrent = Math.sin(currentAngleRad - Math.PI / 2);
    const midRadius = (innerRadius + outerRadius) / 2;

    headPip
      .attr('cx', Math.cos(minAngleRad - Math.PI / 2) * midRadius)
      .attr('cy', Math.sin(minAngleRad - Math.PI / 2) * midRadius)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('cx', cosCurrent * midRadius)
      .attr('cy', sinCurrent * midRadius);

  }, [targetAmount, verifiedAmount, pendingAmount, gaugeMode, verifiedProgress, clampedProgress, selectedMilestone]);

  const activeMilestoneObj = milestones.find((m) => m.percent === selectedMilestone);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden ${className}`}>
      {/* Component Header with Segmented Display Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Campaign Fundraising Progress Gauge</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            D3-calibrated telemetry monitoring verified &amp; incoming funds against the 3.5-year medical rehab protocol
          </p>
        </div>

        {/* Segmented Mode Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setGaugeMode('combined')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              gaugeMode === 'combined'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Verified + Pending</span>
            {pendingAmount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setGaugeMode('verified')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              gaugeMode === 'verified'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Verified Only</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Telemetry Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: D3 Gauge Chart Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] flex justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 420 270"
              className="w-full h-auto overflow-visible select-none"
            />

            {/* Readout Under Needle Center */}
            <div className="absolute bottom-2 text-center pointer-events-none">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">
                {((currentDisplayAmount / targetAmount) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                NPR {currentDisplayAmount.toLocaleString()} of NPR {targetAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Gauge Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100 w-full max-w-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <span>Verified (NPR {verifiedAmount.toLocaleString()})</span>
            </div>
            {pendingAmount > 0 && gaugeMode === 'combined' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 border-dashed shrink-0" />
                <span>Pending Review (NPR {pendingAmount.toLocaleString()})</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
              <span>Target Remaining</span>
            </div>
          </div>
        </div>

        {/* Right: Milestone Analytics & Medical Allocation Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Highlight or Summary Box */}
          {activeMilestoneObj ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 uppercase tracking-wide">
                  Milestone Inspector ({activeMilestoneObj.label})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-medium"
                >
                  ✕ Clear
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900">{activeMilestoneObj.title}</div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Threshold:</span>
                <span className="font-mono font-semibold text-slate-900">
                  NPR {activeMilestoneObj.targetNpr.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Status:</span>
                <span className={`font-semibold ${verifiedAmount >= activeMilestoneObj.targetNpr ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {verifiedAmount >= activeMilestoneObj.targetNpr ? '✓ Achieved' : `NPR ${Math.max(0, activeMilestoneObj.targetNpr - verifiedAmount).toLocaleString()} needed`}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>3.5-Year Clinical Target Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                  <div className="text-[11px] text-slate-500">Remaining to Goal</div>
                  <div className="text-sm font-bold text-slate-900 tabular-nums mt-0.5 font-mono">
                    NPR {remainingToGoal.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                  <div className="text-[11px] text-slate-500">Supporters Count</div>
                  <div className="text-sm font-bold text-slate-900 tabular-nums mt-0.5 font-mono">
                    {verifiedSupportersCount} donors
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Allocation Progress Bars */}
          <div className="space-y-2.5 pt-1">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Rehab Allocation Breakdown</span>
              <span className="text-[11px] text-slate-500 font-mono">Neurigo360 Protocol</span>
            </div>

            {/* Item 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span className="font-medium">Daily Neuro-Physiotherapy (40%)</span>
                <span className="font-mono text-slate-500">NPR 30,00,000</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (verifiedAmount / 3000000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Item 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span className="font-medium">Accessible Housing &amp; Lodging (20%)</span>
                <span className="font-mono text-slate-500">NPR 15,00,000</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (verifiedAmount - 3000000) / 1500000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Item 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span className="font-medium">Daily Sterile Supplies &amp; Bowel Care (15%)</span>
                <span className="font-mono text-slate-500">NPR 11,25,000</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (verifiedAmount - 4500000) / 1125000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <span className="text-emerald-700 font-bold">💡 Tip:</span>
            <span>Click any tick or milestone label (0%, 25%, 50%, 75%, 100%) on the gauge to inspect target funds.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
