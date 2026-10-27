import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  Trophy,
  Award,
  Medal,
  CheckCircle2,
  Gift,
  Star,
  Flame,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';

export const AchievementsModal = ({
  isOpen,
  onClose,
  volunteer
}) => {
  if (!isOpen) return null;

  const completedRescues = volunteer?.completedRescues || 0;
  const mealsDistributed = volunteer?.mealsDistributed || 0;
  const hoursVolunteered = volunteer?.hoursVolunteered || (completedRescues * 2);
  const rewardPoints = volunteer?.rewardPoints || 100;
  const tier = volunteer?.tier || 'Registered Novice';

  const defaultBadges = [
    {
      id: 'b1',
      title: 'Golden Hunger Hero',
      icon: '🏆',
      desc: 'Rescued and delivered over 2,000 community meals',
      unlocked: mealsDistributed >= 2000,
      progress: `${Math.min(mealsDistributed, 2000)} / 2000 meals`
    },
    {
      id: 'b2',
      title: 'Speedy Delivery Star',
      icon: '⚡',
      desc: 'Arrived at pickup location in under 20 minutes',
      unlocked: completedRescues >= 5,
      progress: `${Math.min(completedRescues, 5)} / 5 rescues`
    },
    {
      id: 'b3',
      title: 'Hygiene & Safety Certified',
      icon: '🛡️',
      desc: 'Maintained 100% sanitary insulated food transport',
      unlocked: volunteer?.status === 'VERIFIED_ACTIVE',
      progress: volunteer?.status === 'VERIFIED_ACTIVE' ? 'Verified by Admin' : 'Pending verification'
    },
    {
      id: 'b4',
      title: 'Community Pillar',
      icon: '🌟',
      desc: 'Active volunteer for consecutive weeks',
      unlocked: completedRescues >= 10,
      progress: `${Math.min(completedRescues, 10)} / 10 rescues`
    },
    {
      id: 'b5',
      title: 'Night Owl Rescuer',
      icon: '🌙',
      desc: 'Successfully carried out late-night surplus food rescues',
      unlocked: volunteer?.workingSuitableTime?.includes('Night') || completedRescues >= 8,
      progress: 'Available for evening shifts'
    }
  ];

  const awardsList = volunteer?.awards && volunteer.awards.length > 0 ? volunteer.awards : [
    {
      id: 'a1',
      title: 'AnnaSetu Community Lifesaver Award',
      issuer: 'AnnaSetu Central Humanitarian Council',
      date: 'Recognized 2026'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Achievements & Rewards">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tier & Reward Points Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
                }}
              >
                <Trophy size={18} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-700)', textTransform: 'uppercase' }}>
                  Volunteer Rank
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tier}
                </h3>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Karma Points</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-600)' }}>
                {rewardPoints} pts
              </div>
            </div>
          </div>

          {/* Progress bar to next tier */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Progress to Platinum Lifesaver</span>
              <span>{Math.min(rewardPoints, 1000)} / 1000 pts</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (rewardPoints / 1000) * 100)}%`,
                  height: '100%',
                  background: 'var(--brand-gradient)',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Impact Counters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div
            style={{
              padding: '12px 8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-600)' }}>
              {mealsDistributed}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Meals Rescued</span>
          </div>

          <div
            style={{
              padding: '12px 8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-success-solid)' }}>
              {completedRescues}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Missions Done</span>
          </div>

          <div
            style={{
              padding: '12px 8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>
              {hoursVolunteered} hrs
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Impact Hours</span>
          </div>
        </div>

        {/* Badges Showcase */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} style={{ color: 'var(--brand-500)' }} />
            <span>Earned Badges & Milestones</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {defaultBadges.map(badge => (
              <div
                key={badge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: badge.unlocked ? '1px solid #FCD34D' : '1px solid var(--border-default)',
                  backgroundColor: badge.unlocked ? '#FFFDF5' : 'var(--bg-surface-elevated)',
                  opacity: badge.unlocked ? 1 : 0.65
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: badge.unlocked ? '#FEF3C7' : '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}
                >
                  {badge.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{badge.title}</strong>
                    {badge.unlocked && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--status-success-solid)', backgroundColor: 'var(--status-success-bg)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {badge.desc}
                  </p>
                  <span style={{ fontSize: '10.5px', color: 'var(--brand-600)', fontWeight: 600 }}>
                    {badge.progress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Awards & Certifications */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Medal size={16} style={{ color: 'var(--brand-500)' }} />
            <span>Honors & Recognition</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {awardsList.map(award => (
              <div
                key={award.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ color: 'var(--brand-500)' }}>
                  <Trophy size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{award.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Issued by {award.issuer} • {award.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Perks & Fascination Rewards Catalogue */}
        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gift size={16} style={{ color: 'var(--brand-500)' }} />
              <span>Redeemable Perks & Future Rewards Program</span>
            </h4>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-600)', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              {rewardPoints} pts Available
            </span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.35 }}>
            Every completed rescue earns you +150 to +250 Karma Points. Redeem them for real-world support perks planned to honor your heroic dedication to zero food waste.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            {[
              {
                id: 'p1',
                title: 'Fuel Allowance Card',
                icon: '⛽',
                points: 500,
                desc: '₹350 monthly commute fuel allowance stipend for two-wheeler rescue couriers.',
                status: rewardPoints >= 500 ? 'QUALIFIED • READY TO CLAIM' : `${rewardPoints} / 500 pts`
              },
              {
                id: 'p2',
                title: 'Insulated Hot-Bag & Rain Gear',
                icon: '🎒',
                points: 800,
                desc: 'AnnaSetu commercial-grade thermal insulated carrier crate & waterproof jacket.',
                status: rewardPoints >= 800 ? 'QUALIFIED • READY TO CLAIM' : `${rewardPoints} / 800 pts`
              },
              {
                id: 'p3',
                title: 'Civic Food Safety Certification',
                icon: '📜',
                points: 1200,
                desc: 'Official recognized certification & letter of commendation from Bangalore Civic Food Coalition.',
                status: rewardPoints >= 1200 ? 'QUALIFIED • READY TO CLAIM' : `${rewardPoints} / 1200 pts`
              },
              {
                id: 'p4',
                title: 'Annual Mayor Gala Dinner Pass',
                icon: '🎖️',
                points: 2000,
                desc: 'VIP invitation & stage recognition at the City Zero Waste Annual Leadership Banquet.',
                status: rewardPoints >= 2000 ? 'QUALIFIED' : `${rewardPoints} / 2000 pts`
              }
            ].map(perk => {
              const isQualified = rewardPoints >= perk.points;
              return (
                <div
                  key={perk.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isQualified ? '#FFFDF5' : 'var(--bg-surface)',
                    border: isQualified ? '1px solid #FCD34D' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{perk.icon}</span>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{perk.title}</strong>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-700)' }}>
                      {perk.points} pts
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 4px', lineHeight: 1.3 }}>
                    {perk.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isQualified ? '#065f46' : 'var(--text-tertiary)',
                        backgroundColor: isQualified ? '#d1fae5' : 'var(--bg-surface-elevated)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {perk.status}
                    </span>
                    {isQualified ? (
                      <span style={{ fontSize: '10.5px', color: 'var(--brand-600)', fontWeight: 700 }}>
                        ✓ Reward Unlocked
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        🔒 {perk.points - rewardPoints} pts to go
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="primary" block onClick={onClose}>
          Close & Return
        </Button>
      </div>
    </Modal>
  );
};
