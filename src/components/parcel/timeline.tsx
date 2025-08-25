import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IStatusLog } from "@/types";

interface IProps {
  statusLog: IStatusLog[];
}

const Timeline = ({ statusLog }: IProps) => {
  return (
    <section className="bg-background py-32">
      <div className="container">
        <div className="relative mx-auto max-w-4xl">
          <Separator
            orientation="vertical"
            className=" absolute left-2 top-4"
          />
          {statusLog.map((entry, index) => (
            <div key={index} className="relative pl-8">
              <div
                className={`bg-foreground absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full ${
                  index === statusLog.length - 1 && "animate-pulse bg-primary"
                }`}
              />
              <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:px-3">
                {entry.status}
              </h4>

              <h5 className="text-md -left-34 text-muted-foreground top-3 rounded-xl tracking-tight">
                {new Date(entry.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </h5>

              <Card className="border-none shadow-none p-0">
                <CardContent className="p-4">
                  <div
                    className="prose dark:prose-invert text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: entry.note || ("No note available" as string),
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
