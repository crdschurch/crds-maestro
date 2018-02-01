defmodule CrossroadsInterface.PublicationsController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController
  require IEx

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def get_content() do
    response = %{"content" => %{
      "title" => "Our culture of abusive men",
      "topic" => "culture",
      "duration" => "5 min read",
      "author" => "Brian Tome",
      "date" => "Dec 14, 2017",
      "body" => ~S(<div class="col-md-6">
      <p class="lead">As stories of men behaving badly continue to roll in, we can no longer only ask what is wrong with the accused
          individual. This isn&rsquo;t a story about an individual or even a few individuals. It is a story about
          a sizable segment of the male population in America. That means this isn&rsquo;t just a male nor individual
          issue, it is a cultural issue with cultural cues.</p>
      <p class="article_para">Why do we have so many men from the college campus to the corporate C-Suite to the Hollywood elite dishonoring
          and devaluing women? The problem doesn&rsquo;t just lie with individual testosterone-laden macho men.
          It goes much deeper and much broader. Consider these cultural touchpoints that could help explain why
          so many men devalue and dishonor so many women.</p>
      <p class="article_para">Males aren&rsquo;t saying &ldquo;no&rdquo; to other males. There are 45-year-old boys and there are 15-year-old
          men. One of the things that separates the men from the boys is the willingness to say something unpopular.
          Every male who is in the news has a group of boys around them who didn&rsquo;t say anything or confront
          their friend. I&rsquo;m tired of hearing celebrities say &ldquo;I never knew.&rdquo; Please. Yes you
          did. You were just too weak to do something about it. Male passivity in refusing to speak truth to other
          males has become a cultural norm. The true men among us need to rise up and get comfortable saying, &ldquo;I
          see what you&lsquo;re doing and it isn&rsquo;t acceptable.&rdquo;</p>
      <p class="article_para">Our culture still objectifies women. Why does USA Today contain a standard feature of 100+ pics of &ldquo;Cheerleaders
          around the NFL&rdquo;? Those women are earning an honest living, but features like that are only there
          to get the male sexual juices flowing. Giving men regular and unnecessary reminders of how women look
          and how they seem to exist to turn you on doesn&rsquo;t help a man reinforce a healthy and proper stereotype
          of women.</p>
      <blockquote class="article_blockquote">This  article is to remind myself why Awaited must go away and to give you some additional perspective…</blockquote>
  </div>
  <div class="col-md-3 publication_sidebar">
      <div class="publication_stickyContent">
          <h4 class="collection-header">related</h4>
          <div class="card card--media">
              <a href="#">
                  <img alt="Card image caption" class="card-img-top img-responsive" src="https://cdn-images-1.medium.com/max/600/0*a9E54W3HGR5cRh3W."
                      title="" />
              </a>
              <div class="card-block">
                  <h4 class="list-header">New Year, New You, No Nudes</h4>
                  <h5 class="tagline">Dec 30, 2017</h5>
              </div>
          </div>
          <div class="card card--media">
              <a href="#">
                  <img alt="Card image caption" class="card-img-top img-responsive" src="https://cdn-images-1.medium.com/max/600/0*a9E54W3HGR5cRh3W."
                      title="" />
              </a>
              <div class="card-block">
                  <h4 class="list-header">New Year, New You, No Nudes</h4>
                  <h5 class="tagline">Dec 30, 2017</h5>
              </div>
          </div>
          <div class="card card--media">
              <a href="#">
                  <img alt="Card image caption" class="card-img-top img-responsive" src="https://cdn-images-1.medium.com/max/600/0*a9E54W3HGR5cRh3W."
                      title="" />
              </a>
              <div class="card-block">
                  <h4 class="list-header">New Year, New You, No Nudes</h4>
                  <h5 class="tagline">Dec 30, 2017</h5>
              </div>
          </div>
          <div class="card card--media">
              <a href="#">
                  <img alt="Card image caption" class="card-img-top img-responsive" src="https://cdn-images-1.medium.com/max/600/0*a9E54W3HGR5cRh3W."
                      title="" />
              </a>
              <div class="card-block">
                  <h4 class="list-header">New Year, New You, No Nudes</h4>
                  <h5 class="tagline">Dec 30, 2017</h5>
              </div>
          </div>
      </div>
  </div>
</div>
<div class="article_fullImg">
  <div class="container">
      <div class="col-md-8 col-md-offset-2">
          <img class="push-half-bottom" src="https://images.unsplash.com/photo-1501812325367-78e47cf01c0b?ixlib=rb-0.3.5&amp;s=06483018f699d0e1ae4494b2bd5ab345&amp;auto=format&amp;fit=crop&amp;w=1050&amp;q=80"
              alt="" title="" />
          <span class="tagline text-center block push-bottom">A sample caption</span>
      </div>
  </div>
</div>
<div class="container">
  <div class="col-md-6 col-md-offset-3">
    <p class="article_para">I sat with an entire row of my family during a recent Awaited production with tears in my eyes for two reasons. First, the production is often mesmerizing regarding the most powerfully true story ever told. Second, it is emotional to end a dream I had commissioned our creative folks with over a decade ago. That dream came to fruition. We had created a Cincinnati institution, and in the process earned the respect of the arts community. As I sat with moist eyes I asked myself again, “Did we really want to end all this in hopes of something better?”</p>
    <p class="article_para">Because this decision is so big, complex, and for many, unexpected, it is understandable that people have not heard all of the reasons why we feel God leading us this way. The average person thinks everything comes down to money, and that’s why Awaited is going away. Sorry, it doesn’t. If it was only about money, Awaited might stay.</p>
    <p class="article_para">If you&rsquo;re a guy on this holiday, you get to trade the beauty prep for pressure. If you have a date
          who isn&rsquo;t your girlfriend, she has tons of expectations for this night &mdash; they include you
          becoming her boyfriend sometime before January 5th. If you aren&rsquo;t ready to DTR, then you&rsquo;re
          going to end up with a very confused and emotional girl, no matter how many times you&rsquo;ve told her
          you aren&rsquo;t looking for anything serious. With those being the options, a lot of men opt out of
          bringing a date, and women shouldn&rsquo;t blame them. Our overanalyzing, pixie dust dreams, and unattainable
          expectations are the reason guys avoid asking us out for NYE.</p>

      <div class="article_inlineImg">
          <img class="push-half-bottom" src="https://images.unsplash.com/photo-1468779065891-103dac4a7c48?ixlib=rb-0.3.5&s=3e3dea2d5a090eae733f1760c2d9e97b&auto=format&fit=crop&w=1489&q=80" />
          <span class="tagline text-center block push-bottom">A sample caption</span>
      </div>
      <p class="article_para">Fast forward to the guy coming home at the end of the night, buzzed, and, let&rsquo;s say, frustrated. So
          he does what he believes to be the next best thing. He starts texting in search of nudes. Let&rsquo;s
          be clear, nudes are naked pictures. They allow the guy to feel a physical intimacy with a woman, without
          any of the physical proximity. In that moment, he has masterfully succeeded in getting her naked with
          zero cost to himself. It&rsquo;s a transaction, goods for services if you will. The woman has become
          his porn. The only difference between her and Tila Tequila is she doesn&rsquo;t want this.
      </p>
  </div>),
      "heroImg" => 
        %{"source" => "https://images.unsplash.com/photo-1479030160180-b1860951d696?ixlib=rb-0.3.5&amp;s=18920a3e5e23474110262c6333ef174f&amp;auto=format&amp;fit=crop&amp;w=1350&amp;q=80",
        "caption" => "Richard Shotwell/Invision, via Associated Press"},
      "related" => [
          %{
            "title" => "Best related post ever",
            "thumbnail" => "https://cdn-images-1.medium.com/max/600/1*8VmXU0OvDYTpOOzi-U8Cgw.png",
            "link" => "",
            "date" => "Oct 11, 2015",
            "topic" => "Awesomeness",
            "duration" => "3 min read",
            "medium" => "article",
            "author" => "Carlos Jumanji"
          }, %{
            "title" => "Episode 4: Zits & Things",
            "thumbnail" => "https://cdn-images-1.medium.com/max/600/1*8VmXU0OvDYTpOOzi-U8Cgw.png",
            "link" => " ",
            "date" => "Aug 6, 2017",
            "topic" => "Cool Times",
            "duration" => "5 min watch",
            "medium" => "Video",
            "author" => "Dudes Drinking Beers"
          }
        ]
  }}

      %{"content" => content} = response
      content
  end

  def index do
  end

  def show(conn, %{"id" => id, "medium" => medium}) do
    content = get_content()
    conn
    |> assign(:medium, medium)
    |> assign(:content, content)
    |> put_layout("screen_width.html")
    |> render("publication.html", %{
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})  
  end
end
