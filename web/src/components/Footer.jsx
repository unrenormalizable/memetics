const Footer = ({ appVersion, commitId }) => {
  const repoUrl = 'https://github.com/unrenormalizable/memetics'
  return (
    <div className="mt-0 text-center text-xs">
      <a href={repoUrl} target="_blank">
        memetics
      </a>
      <span> &bull; </span>
      <a
        href={`${repoUrl}/commit/${commitId}`}
        target="_blank"
      >{`${appVersion}`}</a>
    </div>
  )
}

export default Footer
