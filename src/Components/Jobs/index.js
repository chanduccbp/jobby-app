import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    jobs: [],
    searchInput: '',
    employementTypeList: [],
    salaryRange: '',
    apiStatusProfile: apiStatusConstants.initial,
    apiStatusJobs: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({apiStatusProfile: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatusProfile: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusProfile: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatusJobs: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employementTypeList, salaryRange, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employementTypeList.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachObj => ({
        companyLogoUrl: eachObj.company_logo_url,
        employmentType: eachObj.employment_type,
        id: eachObj.id,
        jobDescription: eachObj.job_description,
        location: eachObj.location,
        packagePerAnnum: eachObj.package_per_annum,
        rating: eachObj.rating,
        title: eachObj.title,
      }))
      this.setState({
        jobs: updatedData,
        apiStatusJobs: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusJobs: apiStatusConstants.failure})
    }
  }

  retryProfile = () => {
    this.getProfile()
  }

  retryJobs = () => {
    this.getJobs()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderLoaderJobItems = () => (
    <div className="loader-container-jobs" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-cont">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  getProfileFailureView = () => (
    <button type="button" onClick={this.retryProfile} className="retry-butt">
      Retry
    </button>
  )

  renderProfile = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusConstants.success:
        return this.getProfileView()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  getJobsView = () => {
    const {jobs} = this.state
    const showNoJobsView = jobs.length === 0

    return (
      <>
        {showNoJobsView && (
          <div className="no-jobs-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-pic"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )}
        {!showNoJobsView && (
          <ul className="jobs-list-cont">
            {jobs.map(eachJob => (
              <JobItem key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        )}
      </>
    )
  }

  getJobsFailureView = () => (
    <div className="job-failure-view-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-pic"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.retryJobs} className="retry-butt">
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {apiStatusJobs} = this.state
    switch (apiStatusJobs) {
      case apiStatusConstants.success:
        return this.getJobsView()
      case apiStatusConstants.failure:
        return this.getJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderJobItems()
      default:
        return null
    }
  }

  updateCheckboxList = event => {
    const {employementTypeList} = this.state
    const checkboxId = event.target.id
    if (employementTypeList.includes(checkboxId)) {
      const filteredEmployementTypeList = employementTypeList.filter(
        eachItem => eachItem !== checkboxId,
      )
      this.setState(
        {employementTypeList: filteredEmployementTypeList},
        this.getJobs,
      )
    } else {
      const newEmployementTypeList = [...employementTypeList, checkboxId]
      this.setState({employementTypeList: newEmployementTypeList}, this.getJobs)
    }
  }

  updateSalaryRange = event => {
    this.setState({salaryRange: event.target.id}, this.getJobs)
  }

  renderFilters = () => (
    <div className="filters-cont">
      <h1>Type of Employment</h1>
      <ul className="emp-type-cont">
        {employmentTypesList.map(eachObj => (
          <li key={eachObj.employmentTypeId} className="filter-list-item">
            <input
              type="checkbox"
              onChange={this.updateCheckboxList}
              id={eachObj.employmentTypeId}
            />
            <label htmlFor={eachObj.employmentTypeId}>{eachObj.label}</label>
          </li>
        ))}
      </ul>
      <h1>Salary Range</h1>
      <ul className="salary-range">
        {salaryRangesList.map(eachObj => (
          <li key={eachObj.salaryRangeId} className="filter-list-item">
            <input
              type="radio"
              onChange={this.updateSalaryRange}
              id={eachObj.salaryRangeId}
              name="salary"
            />
            <label htmlFor={eachObj.salaryRangeId}>{eachObj.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickingEnter = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickingSearch = () => {
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="bg-cont">
          <div className="profile-and-filters-cont">
            {this.renderProfile()}
            {this.renderFilters()}
          </div>
          <div className="jobs-cont">
            <div className="search-cont">
              <input
                type="search"
                className="search-bar"
                placeholder="Search"
                onChange={this.updateSearchInput}
                value={searchInput}
                onKeyDown={this.onClickingEnter}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickingSearch}
                className="search-icon-butt"
              >
                <>
                  {' '}
                  <BsSearch className="search-icon" />{' '}
                </>
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
