import { Link } from 'react-router-dom';
import "../css/Problem.css";

const Problem = ({ p }) => {
    return (
        <li className="problem-item">
            <Link to={`/problemset/${p.title}`} className="problem-link">
                <div className="problem-content">
                    <div className="problem-attribute problem-codingScore">{p.codingScore}</div>
                    <div className="problem-attribute problem-difficulty">{p.difficulty}</div>
                    <div className="problem-attribute problem-title">{p.title}</div>
                    <div className="problem-attribute problem-tags">
                        {p.tags.map((tag, index) => (
                            <span key={index} className="problem-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default Problem;
