import Hero from "@/components/hero/Hero";
import React from "react";

const SectionHeading = ({ children }) => (
  <h2 className="mt-8 text-lg font-bold uppercase tracking-wide text-[#FFE150]">
    {children}
  </h2>
);

const Page = () => {
  return (
    <div className="w-full bg-[#1E2F7D]">
      <Hero imgUrl="/images/banner/banner1.jpg" heading="Privacy Policy" />

      <section className="relative overflow-hidden pb-14 pt-12 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
          <div className="mb-8 flex flex-col gap-3 border-b border-white/15 pb-6">
            <h1 className="flex flex-row gap-2 text-5xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #7E93DB" }}
              >
                Privacy
              </span>
              <span>Policy</span>
            </h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#243fb0_0%,#1a2f92_55%,#162a85_100%)] p-5 sm:p-7 md:p-10 shadow-[0_16px_30px_rgba(0,0,0,0.3)] text-white/90 leading-7">
            <p>
              This privacy policy governs your use of the software applications
              for mobile devices that was created by SportsMechanics India
              Private Limited. The Application provides videos score cards of
              the games.
            </p>

            <SectionHeading>
              What information does the Application obtain and how is it used?
            </SectionHeading>

            <SectionHeading>User Provided Information</SectionHeading>
            <p>
              The Application obtains the information you provide when you
              download and register the Application. Registration will be done
              in the backend. Please keep in mind that you will not be able to
              use any of the features offered by the Application unless you
              register with us.
            </p>
            <p className="mt-3">
              When you register with us and use the Application, you generally
              provide (a) mobile number; (b) information you provide us when you
              contact us for help.
            </p>

            <SectionHeading>Automatically Collected Information</SectionHeading>
            <p>
              In addition, the Application may collect certain information
              automatically, including, but not limited to, the type of mobile
              device you use, your mobile device’s unique device ID, the IP
              address of your mobile device, your mobile operating system, the
              type of mobile Internet browsers you use, and information about
              the way you use the Application.
            </p>

            <SectionHeading>
              Does the Application collect precise real time location
              information of the device?
            </SectionHeading>
            <p>
              This Application does not collect precise information about the
              location of your mobile device.
            </p>

            <SectionHeading>
              Do third parties see and/or have access to information obtained by
              the Application?
            </SectionHeading>
            <p>
              Only aggregated, anonymized data is periodically transmitted to
              external services to help us improve the Application and our
              service. We will share your information with third parties only in
              the ways that are described in this privacy statement.
            </p>
            <p className="mt-3">
              We may disclose User Provided and Automatically Collected
              Information:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-2">
              <li>
                as required by law, such as to comply with a subpoena, or
                similar legal process;
              </li>
              <li>
                when we believe in good faith that disclosure is necessary to
                protect our rights, protect your safety or the safety of others,
                investigate fraud, or respond to a government request;
              </li>
              <li>
                with our trusted service providers who work on our behalf, do
                not have an independent use of the information we disclose to
                them, and have agreed to adhere to the rules set forth in this
                privacy statement.
              </li>
              <li>
                if SportsMechanics India Private Limited is involved in a
                merger, acquisition, or sale of all or a portion of its assets,
                you will be notified via email and/or a prominent notice on our
                website of any change in ownership or uses of this information,
                as well as any choices you may have regarding this information.
              </li>
            </ul>

            <SectionHeading>What are my opt-out rights?</SectionHeading>
            <p>
              You can stop all collection of information by the Application
              easily by uninstalling the Application. You may use the standard
              uninstall processes as may be available as part of your mobile
              device or via the mobile application marketplace or network. You
              can also request to opt-out via email, at{" "}
              <a
                href="mailto:tech@tsquaredc.com"
                className="text-[#FFE150] hover:underline"
              >
                tech@tsquaredc.com
              </a>
              .
            </p>

            <SectionHeading>
              Data Retention Policy, Managing Your Information
            </SectionHeading>
            <p>
              We will retain User Provided data for as long as you use the
              Application and for a reasonable time thereafter. We will retain
              Automatically Collected information for up to 24 months and
              thereafter may store it in aggregate. If you’d like us to delete
              User Provided Data that you have provided via the Application,
              please contact us at{" "}
              <a
                href="mailto:tech@tsquaredc.com"
                className="text-[#FFE150] hover:underline"
              >
                tech@tsquaredc.com
              </a>{" "}
              and we will respond in a reasonable time. Please note that some or
              all of the User Provided Data may be required in order for the
              Application to function properly.
            </p>

            <SectionHeading>Children</SectionHeading>
            <p>
              We do not use the Application to knowingly solicit data from or
              market to children under the age of 13. If a parent or guardian
              becomes aware that his or her child has provided us with
              information without their consent, he or she should contact us at{" "}
              <a
                href="mailto:tech@tsquaredc.com"
                className="text-[#FFE150] hover:underline"
              >
                tech@tsquaredc.com
              </a>
              . We will delete such information from our files within a
              reasonable time.
            </p>

            <SectionHeading>Security</SectionHeading>
            <p>
              We are concerned about safeguarding the confidentiality of your
              information. We provide physical, electronic, and procedural
              safeguards to protect information we process and maintain. For
              example, we limit access to this information to authorized
              employees and contractors who need to know that information in
              order to operate, develop or improve our Application. Please be
              aware that, although we endeavor to provide reasonable security
              for information we process and maintain, no security system can
              prevent all potential security breaches.
            </p>

            <SectionHeading>Changes</SectionHeading>
            <p>
              This Privacy Policy may be updated from time to time for any
              reason. We will notify you of any changes to our Privacy Policy by
              posting the new Privacy Policy here and informing you via email or
              text message.
            </p>

            <SectionHeading>Your Consent</SectionHeading>
            <p>
              By using the Application, you are consenting to our processing of
              your information as set forth in this Privacy Policy now and as
              amended by us. &quot;Processing&quot; means using cookies on a
              computer/handheld device or using or touching information in any
              way, including, but not limited to, collecting, storing, deleting,
              using, combining and disclosing information, all of which
              activities will take place in India.
            </p>

            <SectionHeading>Contact us</SectionHeading>
            <p>
              If you have any questions regarding privacy while using the
              Application, or have questions about our practices, please contact
              us via email at{" "}
              <a
                href="mailto:tech@tsquaredc.com"
                className="text-[#FFE150] hover:underline"
              >
                tech@tsquaredc.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
