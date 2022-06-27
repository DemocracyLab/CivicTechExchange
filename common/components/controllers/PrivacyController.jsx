// @flow

import React from "react";
import url from "../utils/url.js";
import Section from "../enums/Section.js";

class PrivacyController extends React.PureComponent<{||}> {
  render(): $React$Node {
    return (
      <div className="container Privacy-root">
        <div className="row">
          <div className="col-12">
            <h1>Privacy Policy</h1>
            <p>
              DemocracyLab is committed to your privacy and makes all reasonable
              efforts to protect your data.
            </p>

            <p>
              This Privacy Policy focuses on the Personal Data (defined below)
              we may collect about you, how we may use that Personal Data, and
              your rights regarding the Personal Data you give us when you
              access our website, hackathon event pages, apps, social media
              pages, and public benefit services (together, “Services”).
              “Personal Data” is information that can be used alone or in
              combination with other information to identity you and typically
              includes information like your name, address, email, phone number,
              IP address, or similar information.
            </p>

            <p>
              Together with our{" "}
              <a href={url.section(Section.Terms)}>Terms of Use</a> (“Terms”),
              this Privacy Policy is a legally binding agreement between you and
              DemocracyLab. By accessing or using the Services, you consent to
              the Terms and this Privacy Policy, including our collection, use,
              and disclosure of your Personal Data as described below.
            </p>

            <ol>
              <li>
                How we protect your privacy:
                <ul>
                  <li>
                    We take reasonable security precautions to prevent
                    unauthorized access to or misuse of your Personal Data.
                  </li>
                  <li>We do not run ads.</li>
                  <li>
                    We do not share your Personal Data with third parties for
                    marketing purposes.
                  </li>
                  <li>
                    We do not engage in cross-marketing or link-referral
                    programs.
                  </li>
                  <li>
                    We do not employ tracking devices for marketing purposes.
                  </li>
                  <li>
                    We do not send you unsolicited communications for marketing
                    purposes.
                  </li>
                  <li>
                    Please review privacy policies of any third party sites
                    linked to from the Services.
                  </li>
                </ul>
              </li>
              <li>
                Below is a list of the types of Personal Data we may collect and
                use to provide and improve our Services, communicate with you,
                respond to your inquiries, combat fraud/abuse, or to enforce
                this Privacy Policy or our Terms:
                <ul>
                  <li>
                    Data you submit or provide (e.g. name, address, email,
                    phone, photos).
                  </li>
                  <li>
                    Web log data (e.g. web pages viewed, access times, IP
                    address, HTTP headers).
                  </li>
                  <li>
                    Data collected via cookies (e.g. search data and “favorites”
                    lists).
                  </li>
                  <li>
                    Web beacons (e.g. electronic images that allow us to count
                    users that have visited pages).
                  </li>
                  <li>
                    Data from 3rd parties (e.g. phone type, geo-location via IP
                    address).
                  </li>
                  <li>
                    Information you submit along with a donation so that we can
                    provide tax-exempt receipts, keep records for taxes and any
                    audits, thank you, and contact you with updates.
                  </li>
                  <li>
                    Information you submit when registering for our events so
                    that we can confirm your attendance, inform you about event
                    changes, and send news about upcoming events.
                  </li>
                  <li>
                    Data you submit to register for our mailing lists online so
                    that we can keep in regular contact with you and update you
                    on our organizational progress.
                  </li>
                </ul>
              </li>
              <li>
                How we store Personal Data:
                <ul>
                  <li>
                    We retain Personal Data as needed for valid non-profit
                    business purposes and/or as required by law.
                  </li>

                  <li>
                    We make good faith efforts to store Personal Data securely,
                    but can make no guarantees.
                  </li>
                  <li>
                    You may access and update certain Personal Data about you
                    via your account login.
                  </li>
                </ul>
              </li>
              <li>
                Circumstances in which we may disclose your Personal Data to
                third parties:
                <ul>
                  <li>
                    To partners, vendors, and service providers (e.g. payment
                    processors) we are working with to provide our Services.
                  </li>
                  <li>
                    To social sites to which you subscribe in order for you to
                    link to them through our site.
                  </li>
                  <li>
                    To respond to subpoenas, search warrants, court orders, or
                    other legal process.
                  </li>
                  <li>
                    To protect our rights, property, or safety, or that of users
                    of DemocracyLab or the general public.
                  </li>
                  <li>
                    With your consent (e.g. if you authorize us to share data
                    with other users).
                  </li>
                  <li>
                    In connection with a merger, bankruptcy, or sale/transfer of
                    assets.
                  </li>
                  <li>
                    In aggregate/summary form, where it cannot reasonably be
                    used to identify you.
                  </li>
                  <li>As you may otherwise expressly request or agree.</li>
                </ul>
              </li>
              <li>
                You have the right to:
                <ul>
                  <li>Ask us what Personal Data we hold about you.</li>
                  <li>Ask us to correct or delete your Personal Data.</li>
                  <li>Tell us to stop using your Personal Data.</li>
                  <li>
                    Tell us to remove you from any of our marketing, contact, or
                    email lists.
                  </li>
                  <li>
                    In exercising your rights, you must provide us with enough
                    information to verify your identity (e.g. name, address, and
                    proof of your identity such as a photo ID at our request).
                  </li>
                </ul>
              </li>
              <li>
                You may contact us to exercise your privacy rights or for any
                other reason by:
                <ul>
                  <li>
                    Completing this contact form:{" "}
                    <a href="https://democracylab.org/contact">
                      https://democracylab.org/contact
                    </a>
                    .
                  </li>
                  <li>
                    Or mailing us at 9612 Keegan Trail, Missoula, MT 59808.
                  </li>
                </ul>
              </li>
              <li>
                You represent the following:
                <ul>
                  <li>
                    You are 13 or older. If you are younger than 13, we do not
                    knowingly collect your Personal Data and you will need your
                    parent's consent to agree to this Privacy Policy and to
                    exercise any of your privacy rights.
                  </li>
                  <li>
                    For international users, by accessing the Services or
                    providing us data, you agree we may use and disclose data we
                    collect as described here or as communicated to you,
                    transmit it outside your resident jurisdiction, and store it
                    on servers in the United States.
                  </li>
                </ul>
              </li>
            </ol>
            <p>
              If we update this policy, we will revise the date, place notices
              on Services if changes are material, and/or obtain your consent as
              required by law.
            </p>
            <p>Last updated: June 27, 2022</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PrivacyController;
