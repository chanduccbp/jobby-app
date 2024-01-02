import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobDetails extends Component {
  state = {
    jobDetails: '',
    similarJobs: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
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
        jobDetails: fetchedData.job_details,
        similarJobs: fetchedData.similar_jobs,
      }

      const formattedJobDetails = {
        companyLogoUrl: updatedData.jobDetails.company_logo_url,
        companyWebsiteUrl: updatedData.jobDetails.company_website_url,
        employmentType: updatedData.jobDetails.employment_type,
        id: updatedData.jobDetails.id,
        jobDescription: updatedData.jobDetails.job_description,
        skills: updatedData.jobDetails.skills.map(eachObj => ({
          imageUrl: eachObj.image_url,
          name: eachObj.name,
        })),
        lifeAtCompany: {
          description: updatedData.jobDetails.life_at_company.description,
          imageUrl: updatedData.jobDetails.life_at_company.image_url,
        },
        location: updatedData.jobDetails.location,
        packagePerAnnum: updatedData.jobDetails.package_per_annum,
        rating: updatedData.jobDetails.rating,
        title: updatedData.jobDetails.title,
      }

      const formattedSimilarJobs = updatedData.similarJobs.map(eachObj => ({
        companyLogoUrl: eachObj.company_logo_url,
        employmentType: eachObj.employment_type,
        id: eachObj.id,
        jobDescription: eachObj.job_description,
        location: eachObj.location,
        rating: eachObj.rating,
        title: eachObj.title,
      }))

      this.setState({
        jobDetails: formattedJobDetails,
        similarJobs: formattedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container-jd" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobDetails = () => {
    this.getJobDetails()
  }

  getJobDetailsFailureView = () => (
    <div className="job-failure-view-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-pic"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.retryJobDetails}
        className="retry-butt-jd"
      >
        Retry
      </button>
    </div>
  )

  getJobDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="jd-cont">
        <div className="job-details-card">
          <div className="company-info-jd">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-jd"
            />
            <div className="title-and-rating-jd">
              <h1>{title}</h1>
              <div className="rating-cont-jd">
                <BsStarFill className="star-icon-jd" size="25" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-and-salary-jd">
            <div className="loc-and-emp-typ-jd">
              <div className="location-cont-jd">
                <MdLocationOn className="loc-icon-jd" />
                <p>{location}</p>
              </div>
              <div className="emp-type-cont-jd">
                <BsFillBriefcaseFill className="brief-case-icon-jd" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-line-jd" />
          <div className="jd-des-and-link">
            <h1>Description</h1>
            <div className="visit-link-cont-jd">
              <a href={companyWebsiteUrl} className="visit-link">
                Visit
              </a>
              <BiLinkExternal />
            </div>
          </div>
          <p className="jd-para">{jobDescription}</p>
          <h1 className="jd-head">Skills</h1>
          <ul className="skills-cont">
            {skills.map(eachObj => (
              <li className="skill-item" key={eachObj.name}>
                <img
                  src={eachObj.imageUrl}
                  alt={eachObj.name}
                  className="skill-pic"
                />
                <p>{eachObj.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="jd-head">Life at Company</h1>
          <div className="life-at-company-cont">
            <p className="jd-para">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="sj-head">Similar Jobs</h1>
        <ul className="similar-jobs-cont">
          {similarJobs.map(eachObj => (
            <li className="similar-job-card" key={eachObj.id}>
              <div className="company-info-sj">
                <img
                  src={eachObj.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo-sj"
                />
                <div className="title-and-rating-sj">
                  <h1>{eachObj.title}</h1>
                  <div className="rating-cont-sj">
                    <BsStarFill className="star-icon-sj" size="25" />
                    <p>{eachObj.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="sj-card-head">Description</h1>
              <p>{eachObj.jobDescription}</p>
              <div className="location-and-role-sj">
                <div className="location-cont-sj">
                  <MdLocationOn className="loc-icon-sj" />
                  <p>{eachObj.location}</p>
                </div>
                <div className="emp-type-cont-sj">
                  <BsFillBriefcaseFill className="brief-case-icon-sj" />
                  <p>{eachObj.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getJobDetailsView()
      case apiStatusConstants.failure:
        return this.getJobDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobDetails()}
      </>
    )
  }
}

export default JobDetails
