import ProjectDetailsContext from '../../context/ProjectDetailsContext'
import TasklistContext from '../../context/TasklistContext'
import Homepage from './Homepage'

function HomepageWrapper() {

  return (
    <ProjectDetailsContext>
      <TasklistContext>
        <Homepage />
      </TasklistContext>
    </ProjectDetailsContext>
  )
}

export default HomepageWrapper