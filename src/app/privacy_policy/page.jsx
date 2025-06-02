import Hero from "@/components/hero/Hero";
import React from "react";

const page = () => {
  return (
    <>
      <Hero imgUrl={"/images/banner/banner1.jpg"} heading={"Privacy Policy"} />
      <div style={styles.container} className="section-width">
        <h1 style={styles.header}>Privacy Policy</h1>
        <p>
          This privacy policy governs your use of the software applications for
          mobile devices that was created by SportsMechanics India Private
          Limited. The Application provides videos score cards of the games.
        </p>

        <p>
          <strong style={styles.strong}>
            What information does the Application obtain and how is it used?
          </strong>
        </p>

        <p>
          <strong style={styles.strong}>User Provided Information</strong>
        </p>
        <p>
          The Application obtains the information you provide when you download
          and register the Application. Registration will be done in the
          backend. Please keep in mind that you will not be able to use any of
          the features offered by the Application unless you register with us.
        </p>
        <p>
          When you register with us and use the Application, you generally
          provide (a) mobile number; (b) information you provide us when you
          contact us for help;.
        </p>

        <p>
          <strong style={styles.strong}>
            Automatically Collected Information
          </strong>
        </p>
        <p>
          In addition, the Application may collect certain information
          automatically, including, but not limited to, the type of mobile
          device you use, your mobile device’s unique device ID, the IP address
          of your mobile device, your mobile operating system, the type of
          mobile Internet browsers you use, and information about the way you
          use the Application.
        </p>

        <strong style={styles.strong}>
          Does the Application collect precise real time location information of
          the device?
        </strong>
        <p>
          This Application does not collect precise information about the
          location of your mobile device.
        </p>

        <strong style={styles.strong}>
          Do third parties see and/or have access to information obtained by the
          Application?
        </strong>
        <p>
          Only aggregated, anonymized data is periodically transmitted to
          external services to help us improve the Application and our service.
          We will share your information with third parties only in the ways
          that are described in this privacy statement.
        </p>

        <p>
          We may disclose User Provided and Automatically Collected Information:
        </p>
        <ul style={styles.list}>
          <li>
            as required by law, such as to comply with a subpoena, or similar
            legal process;
          </li>
          <li>
            when we believe in good faith that disclosure is necessary to
            protect our rights, protect your safety or the safety of others,
            investigate fraud, or respond to a government request;
          </li>
          <li>
            with our trusted service providers who work on our behalf, do not
            have an independent use of the information we disclose to them, and
            have agreed to adhere to the rules set forth in this privacy
            statement.
          </li>
          <li>
            if SportsMechanics India Private Limited is involved in a merger,
            acquisition, or sale of all or a portion of its assets, you will be
            notified via email and/or a prominent notice on our website of any
            change in ownership or uses of this information, as well as any
            choices you may have regarding this information.
          </li>
        </ul>

        <strong style={styles.strong}>What are my opt-out rights?</strong>
        <p>
          You can stop all collection of information by the Application easily
          by uninstalling the Application. You may use the standard uninstall
          processes as may be available as part of your mobile device or via the
          mobile application marketplace or network. You can also request to
          opt-out via email, at{" "}
          <a href="mailto:tech@tsquaredc.com" style={styles.link}>
            tech@tsquaredc.com
          </a>
          .
        </p>

        <strong style={styles.strong}>
          Data Retention Policy, Managing Your Information
        </strong>
        <p>
          We will retain User Provided data for as long as you use the
          Application and for a reasonable time thereafter. We will retain
          Automatically Collected information for up to 24 months and thereafter
          may store it in aggregate. If you’d like us to delete User Provided
          Data that you have provided via the Application, please contact us at{" "}
          <a href="mailto:tech@tsquaredc.com" style={styles.link}>
            tech@tsquaredc.com
          </a>{" "}
          and we will respond in a reasonable time. Please note that some or all
          of the User Provided Data may be required in order for the Application
          to function properly.
        </p>

        <strong style={styles.strong}>Children</strong>
        <p>
          We do not use the Application to knowingly solicit data from or market
          to children under the age of 13. If a parent or guardian becomes aware
          that his or her child has provided us with information without their
          consent, he or she should contact us at{" "}
          <a href="mailto:tech@tsquaredc.com" style={styles.link}>
            tech@tsquaredc.com
          </a>
          . We will delete such information from our files within a reasonable
          time.
        </p>

        <strong style={styles.strong}>Security</strong>
        <p>
          We are concerned about safeguarding the confidentiality of your
          information. We provide physical, electronic, and procedural
          safeguards to protect information we process and maintain. For
          example, we limit access to this information to authorized employees
          and contractors who need to know that information in order to operate,
          develop or improve our Application. Please be aware that, although we
          endeavor to provide reasonable security for information we process and
          maintain, no security system can prevent all potential security
          breaches.
        </p>

        <strong style={styles.strong}>Changes</strong>
        <p>
          This Privacy Policy may be updated from time to time for any reason.
          We will notify you of any changes to our Privacy Policy by posting the
          new Privacy Policy here and informing you via email or text message.
        </p>

        <strong style={styles.strong}>Your Consent</strong>
        <p>
          By using the Application, you are consenting to our processing of your
          information as set forth in this Privacy Policy now and as amended by
          us. "Processing" means using cookies on a computer/handheld device or
          using or touching information in any way, including, but not limited
          to, collecting, storing, deleting, using, combining and disclosing
          information, all of which activities will take place in India.
        </p>

        <strong style={styles.strong}>Contact us</strong>
        <p>
          If you have any questions regarding privacy while using the
          Application, or have questions about our practices, please contact us
          via email at{" "}
          <a href="mailto:tech@tsquaredc.com" style={styles.link}>
            tech@tsquaredc.com
          </a>
          .
        </p>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: 50,
    lineHeight: 1.6,
    color: "#000",
  },
  header: {
    color: "black",
  },
  strong: {
    display: "block",
    marginTop: 20,
    fontSize: "1.1em",
    fontWeight: "bold",
  },
  list: {
    marginTop: 10,
    marginLeft: 20,
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default page;
