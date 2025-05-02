import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="faq">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl"><span className="text-indigo-500">F</span>requently <span className="text-indigo-500">A</span>sked <span className="text-indigo-500">Q</span>uestions</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our platform.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the platform work?</AccordionTrigger>
              <AccordionContent>
                You can login and then choose which mode you want to have, Student or Supervisor. If you are supervisor, you can create courses, if you are in student mode you will be able to join the courses. Create assignments as teacher and assess them as a student!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How much does it cost to use this app?</AccordionTrigger>
              <AccordionContent>
                0 tenge. Our platform is totally free for everyone!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a limit to how many users I can add to course?</AccordionTrigger>
              <AccordionContent>
                No, there can be as much student as you want in a course.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if I forgot to access other students work&apos;s?</AccordionTrigger>
              <AccordionContent>
                That means you will not get a grade for the assignment, but if there was problem on the side of a platform, you can contact as or your supervisor.
              </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="item-5">
              <AccordionTrigger>Do you offer custom integrations?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer custom integrations for Enterprise customers. Our team will work with you to understand your needs and develop integrations with your existing tools and systems. Contact our sales team for more information.
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
