import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

interface StudentProps {
  name: string;
  age: number;
  isStudent: boolean;
  // Define other props if needed
}

function Student(props: StudentProps){
    return(
        <>
        <div className="Student">
            <p>Name:{props.name}</p>
            <p>Age: {props.age}</p>
            <p>Student: {props.isStudent ? "Yes":"No"}</p>
        </div>
        </>
    )
}

Student.defaultProps ={
name: "Guest",
age: 0,
isStudent: false
}

export default Student