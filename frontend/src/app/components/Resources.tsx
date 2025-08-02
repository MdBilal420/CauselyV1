import { Card, CardContent } from "./ui/card";
import { truncateUrl } from "./Progress";


type Resource = {
  url: string;
  title: string;
  description: string;
}


type ResourcesProps = {
  resources: Resource[];
  customWidth?: number;
};

export function Resources({
  resources,
  customWidth,
}: ResourcesProps) {
  return (
    <div data-test-id="resources" className="flex space-x-3 overflow-x-auto">
      {resources.map((resource, idx) => (
        <Card
          data-test-id={`resource`}
          key={idx}
          className="bg-background border-0 shadow-none rounded-xl text-md font-extralight focus-visible:ring-0 flex-none"
          style={{ width: customWidth + "px" || "320px" }}
        >
          <CardContent className="px-6 py-6 relative">
            <div className="flex items-start space-x-3 text-sm">
              <div className="flex-grow">
                <h3
                  className="font-bold text-lg"
                  style={{
                    maxWidth: customWidth ? customWidth - 30 + "px" : "230px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resource.title}
                </h3>
                <p
                  className="text-base mt-2"
                  style={{
                    maxWidth: customWidth ? customWidth - 30 + "px" : "250px",
                    overflowWrap: "break-word",
                  }}
                >
                  {resource.description?.length > 250
                    ? resource.description.slice(0, 250) + "..."
                    : resource.description}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-3 text-muted-foreground inline-block"
                  title={resource.url}
                  style={{
                    width: customWidth ? customWidth - 30 + "px" : "250px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resource.description && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${resource.url}`}
                        alt="favicon"
                        className="inline-block mr-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                      {truncateUrl(resource.url)}
                    </>
                  )}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}