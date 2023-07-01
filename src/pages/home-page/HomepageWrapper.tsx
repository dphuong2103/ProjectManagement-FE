import ProjectDetailsContext from '../../context/ProjectDetailsContext'
import ShowingSideBarOnSmallScreenContext from '../../context/ShowingSideBarOnSmallScreenContext'
import TasklistContext from '../../context/TasklistContext'
import Homepage from './Homepage'

function HomepageWrapper() {

  return (
    <ProjectDetailsContext>
      <ShowingSideBarOnSmallScreenContext>
        <TasklistContext>
          <Homepage />
        </TasklistContext>
      </ShowingSideBarOnSmallScreenContext>
    </ProjectDetailsContext>
  )
}

export default HomepageWrapper