import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Testimonials() {
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-white"
      id="testimonials"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Team
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We are experienced professionals with a passion for technology and
              education. Our team is dedicated to providing the best learning
              experience for our users.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="/assets/images/team/zhanbo.jpeg"
                    alt="Avatar"
                  />
                  <AvatarFallback>ZM</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Zhanbolat Mukan</CardTitle>
                  <CardDescription>
                    Co-Founder, FrontEnd developer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                &quot;This platform has transformed the way we approach our
                projects. The user interface is intuitive and the features are
                incredibly useful. I can&apos;t imagine going back to the old
                way of doing things.&quot;
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="/assets/images/team/yedyge.jpg"
                    alt="Avatar"
                  />
                  <AvatarFallback>YB</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Yedyge Bissultanov</CardTitle>
                  <CardDescription>
                    Co-Founder, BackEnd developer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                &quot;The security features and reliability of this platform are
                unmatched. It&apos;s been a game-changer for our development
                team&apos;s workflow.&quot;
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="/assets/images/team/khaled.jpeg"
                    alt="Avatar"
                  />
                  <AvatarFallback>KM</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Khaled Mohamad</CardTitle>
                  <CardDescription>Founder</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                &quot;As a startup founder, I needed a solution that could scale
                with us. This platform has exceeded all my expectations and
                helped us grow rapidly.&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
