import Hero from "@/components/hero/Hero";
import React from "react";

const SectionHeading = ({ children }) => (
  <h2 className="mt-8 text-lg font-bold uppercase tracking-wide text-[#FFE150]">
    {children}
  </h2>
);

const Bullet = ({ children }) => (
  <li className="leading-7">{children}</li>
);

const Page = () => {
  return (
    <div className="w-full bg-[#1E2F7D]">
      <Hero imgUrl="/images/banner/banner1.jpg" heading="Terms and Conditions" />

      <section className="relative overflow-hidden pb-14 pt-12 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A1A]">
              T20 Mumbai Creators League
            </span>
          </div>
          <div className="mb-8 flex flex-col gap-3 border-b border-white/15 pb-6">
            <h1 className="flex flex-col text-5xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #7E93DB" }}
              >
                Terms and
              </span>
              <span>Conditions</span>
            </h1>
            <p className="text-sm text-white/80 sm:text-base">
              Please read these terms carefully before applying or participating
              in the T20 Mumbai Creator League.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#243fb0_0%,#1a2f92_55%,#162a85_100%)] p-5 sm:p-7 md:p-10 shadow-[0_16px_30px_rgba(0,0,0,0.3)] text-white/90 leading-7">
            <div className="rounded-xl border border-[#FF7A1A]/40 bg-[#0F1B4A]/50 p-5 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-bold uppercase tracking-wide text-[#FF7A1A]">
                  Quick Terms
                </h3>
                <span className="text-xs text-white/60">
                  18 key participation rules
                </span>
              </div>
              <ul className="grid list-disc gap-2 pl-5 marker:text-[#FF7A1A] md:grid-cols-2 md:gap-x-8">
                <Bullet>Applying does not guarantee selection.</Bullet>
                <Bullet>Selected creators may still be disqualified at any stage.</Bullet>
                <Bullet>Only original T20 Mumbai League content will be accepted.</Bullet>
                <Bullet>All posts must tag official T20 Mumbai handles and use the campaign hashtag.</Bullet>
                <Bullet>Only public social media profiles will be considered.</Bullet>
                <Bullet>Creators must attend assigned matchdays and activities.</Bullet>
                <Bullet>Only tournament-related content will be evaluated.</Bullet>
                <Bullet>Copyrighted music or unlicensed content is prohibited.</Bullet>
                <Bullet>Offensive, abusive, hateful, or inappropriate content will lead to disqualification.</Bullet>
                <Bullet>Fake engagement, purchased views, likes, or followers are not allowed.</Bullet>
                <Bullet>Inactive participation during the tournament may result in removal.</Bullet>
                <Bullet>Failure to follow posting guidelines may lead to disqualification.</Bullet>
                <Bullet>Plagiarized or stolen content will not be accepted.</Bullet>
                <Bullet>Non-attendance without prior communication may lead to removal.</Bullet>
                <Bullet>Misuse of creator access, tickets, or privileges is prohibited.</Bullet>
                <Bullet>All participants must follow stadium and tournament policies.</Bullet>
                <Bullet>The organizers reserve the right to disqualify participants at any stage.</Bullet>
                <Bullet>All organizer decisions regarding the contest will be final.</Bullet>
              </ul>
            </div>

            <SectionHeading>Application</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                Applying to the T20 Mumbai Creator League does not guarantee
                selection. The organizers reserve the sole right to accept or
                reject any application at their discretion.
              </Bullet>
              <Bullet>
                Selected creators may still be disqualified at any stage of the
                tournament, including after launch, if they fail to meet
                participation or conduct requirements.
              </Bullet>
              <Bullet>
                Only applicants with public social media profiles will be
                considered. Private accounts will be automatically disqualified.
              </Bullet>
              <Bullet>
                Participants must be legally eligible to enter into this
                agreement and should be 18 years and above.
              </Bullet>
              <Bullet>
                Creators must not be employed by, or have a pre-existing
                exclusivity contract with, any entity whose terms would prohibit
                participation in this activity.
              </Bullet>
            </ul>

            <SectionHeading>Content Requirements & Quality Standards</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                Only original content created specifically for the T20 Mumbai
                League 2026 season will be accepted and scored.
              </Bullet>
              <Bullet>
                All posts must tag the official T20 Mumbai social media handles
                and include the designated campaign hashtag, as briefed at the
                Launch Event on 30th May 2026. Posts without these will not be
                tracked or scored.
              </Bullet>
              <Bullet>
                Only content posted during the official tournament period will
                be eligible for evaluation. Pre-tournament and post-tournament
                content will not count towards scores.
              </Bullet>
              <Bullet>
                Creators are required to cover matchday themes and challenges
                as assigned (e.g. Life of a Cricket Fan, Meme Day, Bollywood x
                Cricket, Stadium Fashion, Match Reactions, etc.).
              </Bullet>
              <Bullet>
                Content must be tournament-related. Personal or off-topic
                content will not be evaluated regardless of engagement numbers.
              </Bullet>
              <Bullet>
                Copyrighted music, audio, or any unlicensed third-party
                intellectual property is strictly prohibited in all content.
                Creators are solely responsible for ensuring they have the
                appropriate licenses or rights for any music used.
              </Bullet>
              <Bullet>
                Plagiarized, stolen, or repurposed content from other creators
                will not be accepted and will result in immediate disqualification.
              </Bullet>
              <Bullet>
                Props provided by the organizers (foam fingers, flags, selfie
                frames, etc.) must be used exclusively for T20 Mumbai Creator
                League content and may not appear in unrelated or competing
                brand content.
              </Bullet>
            </ul>

            <SectionHeading>Conduct & Community Standards</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                Offensive, abusive, hateful, discriminatory, or sexually
                explicit content will result in immediate and permanent
                disqualification.
              </Bullet>
              <Bullet>
                Creators must not make false, misleading, or defamatory
                statements about the T20 Mumbai League, MCA, TSBI, players,
                teams, sponsors, or any associated individuals. MCA may take
                appropriate legal action against such person.
              </Bullet>
              <Bullet>
                Content that disparages competing leagues, brands, or
                individuals is strictly prohibited.
              </Bullet>
              <Bullet>
                Creators must comply with all applicable laws and regulations,
                including but not limited to those governing advertising, data
                privacy, and social media disclosure (e.g. ASCI guidelines for
                paid/sponsored content disclosures).
              </Bullet>
              <Bullet>
                All participants must follow stadium rules, security protocols,
                and MCA venue policies at all times. Failure to comply may
                result in removal from the premises and disqualification.
              </Bullet>
              <Bullet>
                Creators must not engage in or facilitate any form of
                harassment (online or on-ground) towards other creators,
                players, staff, or spectators.
              </Bullet>
            </ul>

            <SectionHeading>Attendance & Participation</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                Selected creators are required to attend the Official Launch
                Event on 30th May 2026 for content briefing, creator kit
                distribution, and challenge announcement.
              </Bullet>
              <Bullet>
                Creators must attend all assigned matchdays and associated
                activities as communicated by the organizing team.
              </Bullet>
              <Bullet>
                Creators who are inactive or fail to post content during
                assigned matchdays may be removed from the competition at the
                organizer&apos;s discretion.
              </Bullet>
              <Bullet>
                Match tickets (up to 5 per game per creator) are issued
                exclusively for the creator. Resale or transfer of tickets for
                commercial gain is strictly prohibited.
              </Bullet>
              <Bullet>
                Creator access passes and venue privileges are non-transferable
                and must not be misused or shared with unauthorized individuals.
              </Bullet>
            </ul>

            <SectionHeading>Prize Distribution</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                All prize amounts are subject to applicable taxes (TDS and
                other statutory deductions) as per Indian law. The net payout
                to creators will be after such deductions.
              </Bullet>
              <Bullet>
                Prize winners must provide valid KYC documentation (PAN card,
                bank account details) within 5 business days of being notified,
                failing which the prize may be forfeited.
              </Bullet>
              <Bullet>
                Prizes are non-transferable and cannot be exchanged for
                alternate benefits, merchandise, or travel.
              </Bullet>
              <Bullet>
                Organizer&apos;s reserve the right to withhold prize distribution
                in the event of any ongoing dispute, investigation, or
                suspected fraud related to the winner&apos;s account.
              </Bullet>
            </ul>

            <SectionHeading>IPR & Content Rights</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                All content created by participating creators during the T20
                Mumbai Creator League remains the intellectual property of the
                brand (MCA).
              </Bullet>
              <Bullet>
                Creators shall retain ownership of the original content created
                by them. By participating, creators grant MCA, T20 Mumbai
                League, TheSmallBigIdea and their affiliates a perpetual,
                irrevocable, royalty-free, worldwide, transferable and
                sublicensable license to use, reproduce, distribute, modify,
                edit, publish, display and exploit such content across any
                media platform for promotional, marketing and archival
                purposes. Creators must not create content that infringes on
                the trademarks, logos, or brand guidelines of T20 Mumbai League
                or any of its official sponsors.
              </Bullet>
              <Bullet>
                Any content featuring player likenesses, official team logos,
                or MCA branding must comply with applicable image rights and
                licensing guidelines.
              </Bullet>
              <Bullet>
                Creators may not use their participation in this contest to
                enter into commercial sponsorship, endorsement, or brand deals
                with entities that are direct competitors of T20 Mumbai League
                or its official sponsors during the tournament period.
              </Bullet>
              <Bullet>
                Creators grant MCA, T20 Mumbai League and their affiliates the
                right to capture, use, reproduce and publish the creator&apos;s
                name, image, likeness, voice and social media handles for
                promotional, marketing and publicity purposes without
                additional compensation.
              </Bullet>
            </ul>

            <SectionHeading>Liability & Indemnification</SectionHeading>
            <ul className="ml-5 list-disc space-y-2 marker:text-[#FF7A1A]">
              <Bullet>
                Participation in the T20 Mumbai Creator League is entirely at
                the creator&apos;s own risk. The organizer accepts no liability
                for any personal injury, property damage, or loss incurred
                during the creator&apos;s attendance at any event or matchday.
              </Bullet>
              <Bullet>
                Creators are solely responsible for all content they publish.
                The organizer shall bear no liability for any claims, damages,
                or legal actions arising from creator content, including but
                not limited to copyright infringement, defamation, or privacy
                violations.
              </Bullet>
              <Bullet>
                Each creator agrees to indemnify, defend, and hold harmless T20
                Mumbai League (MCA), TheSmallBigIdea, their officers,
                employees, and agents from any claims, damages, or expenses
                (including legal fees) arising out of or relating to their
                participation, conduct, or content. The obligations under this
                clause shall survive termination or completion of participation.
              </Bullet>
              <Bullet>
                The organizers are not responsible for technical failures of
                social media platforms, loss of internet connectivity, platform
                algorithm changes, or any circumstances beyond their reasonable
                control that may affect content tracking, scoring, or
                engagement measurement.
              </Bullet>
              <Bullet>
                Creators shall keep confidential all non-public information,
                including operational arrangements, player access areas,
                schedules, commercial arrangements and any information
                designated confidential by MCA.
              </Bullet>
              <Bullet>
                MCA may require creators to modify, remove, delete or cease
                publishing any content that MCA reasonably determines violates
                these terms, applicable laws, sponsor obligations or brand
                guidelines, and creators shall comply promptly.
              </Bullet>
              <Bullet>
                Creator access does not grant entry to restricted areas
                including dressing rooms, broadcast zones or operational areas
                unless specifically authorized.
              </Bullet>
              <Bullet>
                These Terms shall be governed by the laws of India. Courts at
                Mumbai shall have exclusive jurisdiction.
              </Bullet>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
