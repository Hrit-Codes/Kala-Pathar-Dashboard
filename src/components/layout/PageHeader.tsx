type PageHeaderProps={
    heading:string;
    subheading:string;
}

export default function PageHeader({heading, subheading}:PageHeaderProps){
    return(
            <div className="flex flex-col gap-2">
                <h2>{heading}</h2>
                <p>{subheading}</p>
            </div>
    )
}