import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-card">
        <div className="company-info">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-and-rating">
            <h1>{title}</h1>
            <div className="rating-cont">
              <BsStarFill className="star-icon" size="25" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-and-salary">
          <div className="loc-and-emp-type-cont">
            <div className="location-cont">
              <MdLocationOn className="loc-icon" />
              <p>{location}</p>
            </div>
            <div className="emp-type">
              <BsFillBriefcaseFill className="brief-case-icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <h1>{packagePerAnnum}</h1>
        </div>
        <hr className="hr-line-job-item" />
        <h1 className="job-card-des-head">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
