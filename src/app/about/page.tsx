import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MaxWidthWrapper from "@/common/components/MaxWidthWrapper";
import { Card, CardTitle, CardDescription } from "@/common/components/ui/Card";

export default function About() {
  return (
    <>
      <Head>
        <title>About Mockbird - Mock Interview Platform</title>
        <meta name="description" content="Mockbird is a pioneering mock interview platform connecting candidates with top industry recruiters. Learn about our mission, our team, and how we're changing the interview landscape." />
        <meta property="og:title" content="About Mockbird - Mock Interview Platform" />
        <meta property="og:description" content="Explore Mockbird, the unique platform where tech industry recruiters provide personalized mock interviews and feedback to help candidates succeed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mockbird.com/about" />
        <link rel="canonical" href="https://www.mockbird.com/about" />
      </Head>

      <MaxWidthWrapper className="flex flex-col items-center justify-center text-center mt-10 sm:mt-12">
        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
          About <span className="text-sxpurple">Mockbird</span>
        </h1>
        <p className="mt-5 max-w-prose text-lg sm:text-2xl">
          Discover how Mockbird is revolutionizing the way tech industry candidates prepare for interviews.
        </p>
        
        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-20">
          <Card>
            <CardTitle>Bhola</CardTitle>
            <Image src="/team_member_1.png" alt="Team member 1" width={128} height={128} quality={100} />
            <CardDescription>
              Description
            </CardDescription>
          </Card>
          
          <Card>
            <CardTitle>Ricky</CardTitle>
            <Image src="/team_member_2.png" alt="Team member 2" width={128} height={128} quality={100} />
            <CardDescription>
              Description
            </CardDescription>
          </Card>

          <Card>
            <CardTitle>Chris</CardTitle>
            <Image src="/team_member_3.png" alt="Team member 3" width={128} height={128} quality={100} />
            <CardDescription>
              Description
            </CardDescription>
          </Card>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
